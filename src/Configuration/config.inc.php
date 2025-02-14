<?php

$GLOBALS['settings'] = [
    'backendValidation' => [
        'categoryName' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie den Namen korrekt an. <br>',
        ],
        'productName' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie den Namen korrekt an. <br>',
        ],
        'productPrice' => [
            'mode'    => 'decimal',
            'message' => 'Bitte geben Sie den Preis korrekt an. <br>',
        ],
        'productDescription' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie die Beschreibung korrekt an. <br>',
        ],
        'productSelector' => [
            'mode'    => 'select',
            'message' => 'Bitte wählen Sie ein Produkt. <br>',
        ],
        'categorySelector' => [
            'mode'    => 'select',
            'message' => 'Bitte wählen Sie eine Kategorie. <br>',
        ],
        'manufacturerName' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie den Namen korrekt an. <br>',
        ],
        'manufacturerInformation' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie die Informationen korrekt an. <br>',
        ],
        'manufacturerSelector' => [
            'mode'    => 'select',
            'message' => 'Bitte wählen Sie einen Hersteller. <br>',
        ],
        'alcoholic' => [
            'mode' => 'check',
        ],
        'pfand' => [
            'mode'    => 'select',
            'message' => 'Bitte geben Sie den Pfand korrekt ein. <br>',
        ],
        'keywords' => [
            'mode'    => 'keywords',
            'message' => 'Bitte geben Sie die Schlüsselworte korrekt an. <br>',
        ],
        'eMail' => [
            'mode'    => 'email',
            'message' => 'Bitte geben Sie Ihre E-Mail Adresse korrekt an. <br>',
        ],
        'password' => [
            'mode'    => 'password',
            'message' => 'Ihr Passwort erfüllt den Standard nicht. <br>',
        ],
        'confirmPassword' => [
            'mode'    => 'confirmPassword',
            'message' => 'Ihre Passwortbestätigung stimmt nicht überein. <br>',
        ],
        'firstName' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie Ihren Vornamen korrekt an. <br>',
        ],
        'lastName' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie Ihren Nachnamen korrekt an. <br>',
        ],
        'address' => [
            'mode'    => 'stringAddress',
            'message' => 'Bitte geben Sie Ihre Straße und Hausnummer korrekt an. <br>',
        ],
        'postal' => [
            'mode'    => 'intPostal',
            'message' => 'Bitte geben Sie Ihre Postleitzahl korrekt an. <br>',
        ],
        'city' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie Ihren Wohnort korrekt an. <br>',
        ],
        'company' => [
            'mode'    => 'emptyString',
            'message' => 'Bitte geben Sie den Firmennamen korrekt an. <br>',
        ],
        'companyDifferent' => [
            'mode'    => 'emptyString',
            'message' => 'Bitte geben Sie den Firmennamen in der Lieferadresse korrekt an. <br>',
        ],
        'firstNameDifferent' => [
            'mode'    => 'emptyString',
            'message' => 'Bitte geben Sie den Vornamen in der Lieferadresse korrekt an. <br>',
        ],
        'lastNameDifferent' => [
            'mode'    => 'emptyString',
            'message' => 'Bitte geben Sie den Nachnamen in der Lieferadresse korrekt an. <br>',
        ],
        'addressDifferent' => [
            'mode'    => 'emptyString',
            'message' => 'Bitte geben Sie Straße und Hausnummer in der Lieferadresse korrekt an. <br>',
        ],
        'cityDifferent' => [
            'mode'    => 'emptyString',
            'message' => 'Bitte geben Sie den Ort in der Lieferadresse korrekt an. <br>',
        ],
        'postalDifferent' => [
            'mode'    => 'emptyString',
            'message' => 'Bitte geben Sie die Postleitzahl in der Lieferadresse korrekt an. <br>',
        ],
        'differentDeliveryAddress' => [
            'mode' => 'check',
        ],
        'couponName' => [
            'mode'    => 'string',
            'message' => 'Bitte geben Sie einen gültigen Namen ein.',
        ],
        'couponAmount' => [
            'mode'    => 'decimal',
            'message' => 'Bitte geben Sie die Rabatthöhe in Euro korrekt an.',
        ],
        'couponPercent' => [
            'mode'    => 'percent',
            'message' => 'Bitte geben sie die Rabatthöhe in Prozent korrekt an.',
        ],
        'buttonSave' => [
            'mode' => 'button',
        ],
    ],
];