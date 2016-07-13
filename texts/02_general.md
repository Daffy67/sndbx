# 02 - Allgemeines

## <a name='TOC'></a> Inhaltsverzeichnis

1. [01 Einführung](#start)
1. [02 Voraussetzung](#requirement)
1. [03 Datensicherheit und PCI DSS](#pci)
1. [04 3D Secure](#3ds)
1. [05 Dynamic Currency Conversion](#dcc)
1. [06 Unterstützte Zahlungsmittel](#paymentmethods)

## <a name="start"></a> 01 Einführung

Die Saferpay JSON API (**J**ava**S**cript **O**bject **N**otation **A**pplication **P**rogramming **I**nterface), in der Folge auch JA genannt, ist eine moderne schlanke Schnittstelle, die unabhängig von Programmiersprachen ist. 
Die JA unterstützt alle Saferpay Methoden und ist für alle Shop-Systeme, Callcenter-Lösungen, Warenwirtschafts-, ERP-, CRM-Systeme sowie alle anderen Einsatzgebiete geeignet, in denen Online-Zahlungen verarbeitet werden müssen.
Dieser Integrationsguide dient als Hilfestellung für Programmierer und Integratoren. Er soll gängige Abläufe beschreiben und Gängige Fragen beantworten.
Dieses Dokument beschäftigt sich mit den Grundlagen der Saferpay JSON-API.

## <a name="requirement"></a> 02 Voraussetzung

Die Nutzung der JA setzt Folgendes voraus:

* Eine entsprechende Lizenz für das Saferpay Modul.
* Das Vorhandensein einer gültigen Kennung mit Benutzername und Passwort für das Saferpay Backoffice.
* Mindestens ein aktives Saferpay Terminal, über das die Zahlungen durchgeführt werden können ist vorhanden und die dazugehörige 
* Saferpay Terminalnummer sowie die Saferpay Kundennummer liegen vor.
* Ein gültiger Akzeptanzvertrag für Kreditkarten oder ein anderes Zahlungsmittel liegt vor.

## <a name="pci"></a>  03 Datensicherheit und PCI DSS

Die Kreditkartenorganisationen haben das Sicherheitsprogramm PCI DSS (Payment Card Industry Data Security Standard) ins Leben gerufen, um Betrug mit Kreditkarten und deren Missbrauch vorzubeugen.

Bitte beachten Sie bei der Gestaltung des Zahlungsprozesses und dem Einsatz von Saferpay  die PCI DSS Richtlinien. 

Bei Nutzung des Saferpay Hosted Forms zusammen mit dem optionalen Dienst Saferpay Secure Card Data, abgekürzt SCD, können Sie die Zahlungsprozesse so sicher gestalten, dass keine Kreditkartennummern auf Ihren (Web)Servern verarbeitet, weitergeleitet oder gespeichert werden. 

Bei Nutzung der Saferpay Payment Page erfasst der Karteninhaber seine Kreditkartennummer und das Verfalldatum nicht innerhalb der E-Commerce-Applikation des Händlers, sondern innerhalb der Saferpay Payment Page. Da die E-Commerce-Applikation und Saferpay auf physisch getrennten Plattformen betrieben werden, besteht keine Gefahr, dass die Kreditkartendaten in der Datenbank des Händlersystems gespeichert werden können. 

Das Risiko eines Missbrauchs der Kreditkartendaten wird durch die Nutzung von Saferpay Secure Card Data oder der Saferpay Payment Page deutlich reduziert und der Aufwand der PCI DSS Zertifizierung verringert sich für den Händler deutlich.

Fragen zu PCI DSS kann Ihnen Ihr Verarbeiter oder ein darauf spezialisiertes Unternehmen beantworten [Siehe hier](https://www.pcisecuritystandards.org).

## <a name="3ds"></a> 04 3D Secure

3-D Secure, abgekürzt 3DS, wird von Visa (Verified by Visa), MasterCard (MasterCard SecureCode), American Express (SafeKey) und Diners Club (ProtectBuy) unterstützt. Händler, die das 3-D Secure Verfahren anbieten profitieren von der erhöhten Sicherheit bei der Kreditkartenakzeptanz und weniger Zahlungsausfällen durch die Haftungsumkehr („Liability Shift“). Es ist dabei nicht von Bedeutung, ob die Karteninhaber (KI) an dem Verfahren teilnehmen oder nicht.

Das 3-D Secure Verfahren kann ausschließlich für Zahlungen im Internet eingesetzt werden. Der KI muss, sofern er an den Verfahren teilnimmt, sich während der Zahlung gegenüber seiner kartenausgebenden Bank (Issuer) ausweisen.
Zahlungen, die der Händler mit 3-D Secure abwickelt, sind speziell zu kennzeichnen. Nur wenn die entsprechenden Merkmale mit der Autorisierung an die Kreditkartengesellschaft gesendet werden, gilt die Haftungsumkehr.
Das Saferpay Merchant Plug-In, abgekürzt MPI, unterstützt die notwendigen Interaktionen und den sicheren Datenaustausch zwischen den beteiligten Systemen. Die JSON API wickelt diesen Schritt automatisiert über das Transaction Interface (Initialize) und über die Payment Page ab, sodass kein zusätzlicher Integrationsaufwand anfällt. Die Authentifizierung des KI erfolgt über ein Webformular, das der Issuer oder ein von ihm beauftragter Dienstleister hostet. Für eine 3-D Secure Authentifizierung benötigt der KI daher zwingend einen Internet Browser.

1. Der Händler sendet die Kreditkartendaten zusammen mit den relevanten Zahlungsdaten an Saferpay.
2. Saferpay prüft, ob der KI an dem 3-D Secure Verfahren teilnimmt oder nicht. Nimmt er teil, muss er sich gegenüber seiner Bank authentifizieren. Falls nicht, wird die Zahlung ohne Authentifizierung durchgeführt.
3. Über den Internet Browser des KI wird die 3-D Secure Anfrage an die kartenausgebende Bank weitergeleitet. Der KI muss sich mit einem Passwort, Zertifikat oder einer anderen Methode ausweisen.
4. Das Ergebnis dieser Überprüfung (Authentifizierung) wird über den Internet Browser des Kunden zurück an Saferpay gesendet. 
5. Saferpay prüft das Resultat und stellt sicher, dass keine Manipulation vorliegt. Die Zahlung kann fortgeführt werden, wenn die Authentifizierung erfolgreich verlaufen ist.
6. Saferpay bindet die MPI-Daten an den von der JSON API verwendeten Token und fragt diese bei der Autorisierung der Karte automatisch ab.

## <a name="dcc"></a> 05 Dynamic Currency Conversion

Dynamic Currency Conversion, abgekürzt DCC, steht nur für SIX Akzeptanzverträge mit DCC-Erweiterung zur Verfügung. Das für die Zahlungsanfragen zugrunde liegende Terminal erhält hierbei eine Basiswährung in der alle Transaktionen abgerechnet werden. Internationalen Kunden wird mittels DCC der Kaufbetrag in der Basiswährung und zum besten Wechselkurs in ihrer Landeswährung angezeigt. Der Kunde kann selbst entscheiden, in welcher Währung er bezahlen möchte.
Eine gesonderte Implementierung auf Seiten des Händlers ist für DCC nicht notwendig. Saferpay behandelt diesen Schritt während des Redirect automatisch. 

## <a name="paymentmethods"></a> 06 Unterstützte Zahlungsmittel

<table class="table table-striped">
  <thead>
    <tr>
      <th>Zahlungsmittel</th>
      <th>Transaction Interface</th>
      <th>Payment Page</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Visa</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>V PAY</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>MasterCard</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>Maestro International</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>American Express</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>Diners Club</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>JCB</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>Bonus Card</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>Postfinance E-Finance</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>PostFinance Card</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>MyOne</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>SEPA Lastschrift (Nur DE!)</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>PayPal</td>
      <td>verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>ePrzelewy</td>
      <td>Nicht verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>Homebanking AT (eps)</td>
      <td>Nicht verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>GiroPay</td>
      <td>Nicht verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>iDeal</td>
      <td>Nicht verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>BillPay Kauf auf Rechnung</td>
      <td>Nicht verfügbar</td>
      <td>verfügbar</td>
    </tr>
    <tr>
      <td>BillPay Lastschrift</td>
      <td>Nicht verfügbar</td>
      <td>verfügbar</td>
    </tr>
  </tbody>
</table>