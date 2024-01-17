# Test

Damit nicht mehr angerufen wird, zum "neue Programm machet"...

# Mubea-TDT-Recipes-HMI

## von Matthias Trudewind und John Schmidt

### Okt. 2023

Git Repository zum Proujekt "Mubea-TDT-Recipes-HMI"

## Inhaltsverzeichnis

- [Einleitung](#einleitung)
- [Vorbereitung](#vorbereitung)
- [Installation](#installation)
- [Konfiguration](#konfiguration)
- [Benutzung](#benutzung)
- [Entwickler](#entwickler)
- [Lizenz](#lizenz)

## Einleitung

**Mubea-TDT-Recipes-HMI**  
Mubea-TDT-Recipes-HMI ist eine Web-Applikation, die auf einem node.js-Server mit dem Express-Framework basiert.  
Die Architektur folgt dem MVC (Model-View-Controller)-Muster und nutzt (vorerst die Pug-Template-Engine) sowie eine Datenbank namens MongoDB.

Die Webapplikation dient dazu, TDT- Rezepte zu erstellen, Verwalten, und sie zu einer SPS zu schicken...
und eine alte Version... zu ersetzen...

&nbsp;

## Vorbereitung

### Voraussetzungen

Bevor Sie dieses Projekt verwenden können, stellen Sie sicher, dass die folgenden Voraussetzungen erfüllt sind, bevor Sie mit dem Projekt fortfahren:

- Betriebssystem: Windows 11 (oder eine kompatible Version)
- Webbrowser: Unterstützt werden die neuesten Versionen von Google Chrome und Microsoft Edge.
- Node.js: Stellen Sie sicher, dass Sie Node.js in Version 10.0.0 oder höher installiert haben. Sie können Node.js von der offiziellen Website herunterladen und installieren: https://nodejs.org/en/.
- NPM: NPM (Node Package Manager) wird zusammen mit Node.js installiert und sollte automatisch verfügbar sein. Sie können überprüfen, ob NPM installiert ist, indem Sie den Befehl npm --version in Ihrer Befehlszeile ausführen. https://www.npmjs.com/
- MongoDB: Installieren Sie MongoDB in Version 10.10.2. Sie können MongoDB von der offiziellen Website herunterladen und entsprechend den Anweisungen installieren: https://www.mongodb.com/.

## Installation

Um das Projekt einzurichten, gehen Sie folgendermaßen vor:

1. Navigieren Sie zum Hauptverzeichnis des Projekts.
2. Öffnen Sie die Befehlszeile (Command Prompt) oder das Terminal.
3. Installieren Sie alle erforderlichen Abhängigkeiten mit folgendem Befehl:

```bash
npm install
```

## Konfiguration

Um die Konfiguration vorzunehmen, befolgen Sie bitte die folgenden Schritte:

1. Navigieren Sie zum Hauptverzeichnis des Projekts.
2. Erstellen Sie eine Datei mit dem Namen 'config.env' im Hauptverzeichnis.
3. Fügen Sie die folgenden Zeilen in die config.env-Datei ein:

---

```bash
#Port Configuration
DEV_PORT=6555
PROD_PORT=6557


#DB Configuration
DB_CONNECTOR=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=TDT_MubeaDB

```

---

Speichern Sie die 'config.env-Datei', nachdem Sie die Konfigurationseinstellungen vorgenommen haben.

## Benutzung (lokal)

Für die Verwendung der Web-Anwendung müssen sowohl der Bundler als auch der Server ausgeführt werden. Stellen Sie sicher, dass beide Komponenten ordnungsgemäß laufen.

Wenn Sie Tests durchführen möchten, muss der Server ebenfalls gestartet sein, da die Tests auf den laufenden Server zugreifen müssen.

### Bundler im Entwicklungs- Modus starten

Mit folgendem Befehl wird der Bundler gestartet:

```bash
npm run watch:js_dev
```

### Server im Entwicklungsmodus starten

Mit folgendem Befehl wird der Server im Entwicklungs- Modus gestartet:

```bash
npm run dev
```

### Gestarteter Prozess beenden

Mit folgendem Befehl kann ein gestarteter Prozess beendet werden:

```bash
crtl+c
```

### Debugger starten

Mit folgendem Befehl wird der Debugger gestartet:

```bash
npm run debug
```

### Unit- Test's starten

Mit folgendem Befehl werden die Unit- Tests gestartet:

```bash
npm run test
```

### End-toEnd- Test's starten

Mit folgendem Befehl werden die End-to-End- Tests gestartet:

```bash
npm run test_selenium
```

### Datenbank erzeugen:

Mit folgendem Befehl wird die Datenbank erzeugt:

```bash
node .\dev-data\data\import-dev-data.mjs --import
```

### Datenbank löschen:

Mit folgendem Befehl wird die Datenbank gelöscht:

```bash
node .\dev-data\data\import-dev-data.mjs --delete
```

---

## Produktions-Modus (Provisorisch)

### Bundler im Produktions- Modus starten

Mit folgendem Befehl wird der Bundler gestartet:

```bash
npm run build:js_prod
```

### Server im Produktions- Modus starten

Mit folgendem Befehl wird der Server im Produktions- Modus gestartet:

```bash
npm run start:prod
```

---

### Login als Admin

Um sich als Admin anzumelden, verwenden Sie bitte die folgenden Anmeldeinformationen:

- employeenumber:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**70220**
- password:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**test1234**

Geben Sie diese Informationen im Browser ein, um sich als Admin anzumelden.

## Entwickler

Matthias Trudewind, John Schmidt, 2023

## Lizenz

&copy; von Mubea AG. Alle Rechte vorbehalten.
