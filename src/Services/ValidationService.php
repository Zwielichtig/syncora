<?php

namespace App\Services;

require __DIR__ . '/../Configuration/config.inc.php';

class ValidationService
{
    public function validateForm($request)
    {
        $errorMessages = [];
        $valid         = true;
        $filter        = $GLOBALS['settings']['backendValidation'];

        foreach ($request as $key => $value) {
            if (!empty($value)) {
                switch ($filter[$key]['mode']) {
                    case 'username' === $filter[$key]['mode'] && preg_match('/^[a-zA-Z0-9_äÄöÖüÜß.!?,;:()&*-+@#\$%^&+=<>|~`{}\[\]\\\\]*$/', $value):
                        break;
                    case 'email' === $filter[$key]['mode'] && preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $value):
                        break;
                    case 'password' === $filter[$key]['mode'] && preg_match('/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_.,]).{8,}$/', $value):
                        break;
                    case 'passwordConfirm' === $filter[$key]['mode'] && $value === $request['password']:
                        break;
                    default:
                        $errorMessages = $filter[$key]['message'];
                        print_r($errorMessages);
                        $valid = false;
                }
            }
        }

        return $valid;
    }
}