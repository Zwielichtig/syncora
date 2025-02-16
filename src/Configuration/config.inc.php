<?php

$GLOBALS['settings'] = [
    'backendValidation' => [
        'email' => [
            'mode'    => 'email',
            'message' => 'Bitte geben Sie Ihre E-Mail Adresse korrekt an. <br>',
        ],
        'password' => [
            'mode'    => 'password',
            'message' => 'Ihr Passwort erfüllt nicht den Standard. <br>',
        ],
        'passwordConfirm' => [
            'mode'    => 'passwordConfirm',
            'message' => 'Ihre Passwortbestätigung stimmt nicht mit Ihrem Passwort überein. <br>',
        ],
        'username' => [
            'mode'    => 'username',
            'message' => 'Bitte geben Sie einen gültigen Nutzernamen an. <br>',
        ],
    ],
];