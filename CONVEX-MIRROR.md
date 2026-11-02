# ARB 19: MongoDB → Convex (Produktion)

Seit 2026-11-02 spiegelt der Worker nur noch in die **Produktions**-Organisation
„ARB 19“ (`flexible-deer-25`). Das Testdeployment wird nicht mehr beliefert.
Die `.env` und `.env.convex-mirror` enthalten das Prod-Ziel, den Prod-Schlüssel
und die Prod-Zuordnung (Sicherung der alten Test-Werte: `.local/env-backup-2026-11-02/`).
Der Erstimport nach Prod ist bereits erfolgt; der Container setzt nach dem Start
mit einem Abgleich ohne Übertragungen fort und hört dann auf Änderungen.

Der NestJS-Provider startet bei `CONVEX_MIRROR_ENABLED=true` im Hintergrund.
Er liest ausschließlich `newlogbooks` und schreibt Fahrten, Tankfüllungen und
Services in die Organisation ARB 19. Thomas ist Owner, Andrea, Claudia und
Oliver sind Administratoren. Die Fahrerzuordnung ist explizit; unbekannte
Namen oder Fahrzeuge stoppen die Übertragung, statt den Owner einzusetzen.
MX5 bleibt in Meilen; die fünf anderen Fahrzeuge verwenden Kilometer.

## Container aktualisieren

Die vorbereitete **`.env`** enthält alle bestehenden Backend-Variablen,
den SendGrid-Schlüssel und die Convex-Synchronisierung mit den konkreten IDs.
Sie ist git-ignoriert und wird separat zusammen mit dem aktualisierten Projekt
auf den V-Server kopiert. Im Container setzt sie `NODE_ENV=production`;
das Convex-Ziel ist das Produktionsdeployment mit ARB 19.

```sh
docker build -t smarthome-backend:arb19-prod .
```

Anschließend den bisherigen Container wie gewohnt durch das neue Image ersetzen.
Beim bisherigen `docker run`-Befehl **`--env-file .env`** ergänzen und die bisherigen
Portzuordnungen, Netzwerke, Volumes und die Restart-Policy übernehmen.
Der konfigurierte interne Port ist `3000`. Ein Beispiel für einen neuen Container:

```sh
docker run -d --name smarthome-backend --restart unless-stopped \
  --env-file .env -p 3000:3000 smarthome-backend:arb19-prod
```

Dieses Beispiel erst verwenden, nachdem der bisherige gleichnamige Container
im Rahmen des normalen Updates ersetzt wurde. Bei Docker Compose entsprechend
`env_file: .env` im Backend-Service setzen und das Image neu bauen/starten.
Keine Secrets werden ins Image kopiert. `docker logs smarthome-backend` meldet
`Convex mirror: listening for MongoDB changes`, sobald der Worker aktiv ist.
`CONVEX_MIRROR_ENABLED=false` deaktiviert ihn. Ein Fehler der Synchronisierung
unterbricht keine Requests der alten App.

## Manueller Abgleich / lokale Ausführung

```sh
npm run build
node scripts/convex-mirror.cjs          # einmaliger Abgleich
node scripts/convex-mirror.cjs --watch  # Abgleich und dauerhafte Änderungen
```

Es darf je Zielorganisation nur ein aktiver Worker laufen. Eine MongoDB-Lease
verhindert parallele Worker; nach einem harten Abbruch läuft sie nach maximal
120 Sekunden aus. Im Container wird kein zusätzlicher Prozess benötigt.
Bei deaktiviertem Worker bleibt die bestehende App unverändert nutzbar.

## Zuverlässigkeit und Verbrauch

- Erstabgleich in chronologischen Batches von höchstens 50 Quelldatensätzen.
- Danach MongoDB Change Stream; bis zu 2 Sekunden Bündelung pro Gruppe.
- Im Leerlauf **null Convex-Aufrufe**. Pro verändertem Batch: ein HTTP-Handler
  und eine atomare Mutation, keine Aufrufe je Nutzer oder Datensatz.
- SHA-256 des normalisierten Inhalts wird in einer separaten MongoDB-Collection
  gespeichert. Unveränderte und nur abgeleitete Änderungen werden nicht gesendet.
- Erst nach bestätigtem Convex-Commit werden Hashes und Resume-Token gespeichert.
  Ein Retry verwendet stabile MongoDB-IDs und erzeugt keine Duplikate.
- Nach Ausfällen wird der Stream fortgesetzt. Bei abgelaufenem Resume-Token oder
  anderen Fehlern folgt ein erneuter Quellabgleich mit exponentieller Wartezeit.
- Inserts, Updates und Deletes werden gespiegelt. Entfernte Tank-/Serviceanteile
  werden auch in Convex entfernt. Nur Datensätze mit dem Quell-ID-Präfix werden
  gelöscht; andere App-Datensätze werden nicht angefasst.
- Der Worker schreibt nur seine Checkpoints/Hashes/Lease in MongoDB. Es existiert
  keinerlei Rückweg von Convex in die Quelldaten.
- Änderungen an importierten Einträgen in der neuen App gehen nicht zurück.
  Beim nächsten inhaltlichen Quellupdate überschreibt MongoDB diese Felder.
- Der HTTP-Schlüssel ist ausschließlich für das Produktionsdeployment und ARB 19
  gültig; Clerk- oder Convex-Admin-Zugänge sind im Container nicht notwendig.

Notizen werden übernommen. Rechnungen, Gutscheine, Rezepte und die ungenutzte
alte `logbooks`-Collection werden nicht importiert; dafür existiert in der neuen
App kein entsprechender Importvertrag. Abgeleitete Kosten-/Verbrauchswerte
werden wie beim bisherigen Legacy-Import nicht separat gespeichert.
Historische Fahrten sind gesperrt. Fahrzeughersteller/Kennzeichen werden nicht
erfunden; diese in der neuen App bei Bedarf ergänzen.

## Prüfungen

```sh
npm run build
npx jest --runInBand src/logbook/convex-sync
```

Nach dem Containerstart eine echte Fahrt in der alten App erfassen und in ARB19
prüfen. Zum Abgleich ohne laufenden Container denselben Einmalbefehl wiederholen:
bei unveränderter Quelle soll er `requests: 0` melden.

Die vollständige Testsuite benötigt eine **separate** Datenbank, z. B.
`MONGODB_TEST_URI=mongodb://localhost/logbook_test npm test`.
Die Konfiguration blockiert fehlende oder mit der App identische Testziele.
Beim Einrichten dieser Integration wurde ein vorhandener gemeinsamer URI entdeckt,
nachdem bestehende Integrationstests die Quelle gelöscht hatten. Die 1.694
Quelldokumente wurden aus dem Export vom 12.09.2026 wiederhergestellt und
vollständig gegen diesen Export geprüft; ARB19 wurde anschließend erneut
aufgebaut. Details und Nachweise stehen im neuen Projekt unter
`docs/arb19-legacy-mirror.md`.
