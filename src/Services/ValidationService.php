<?php

namespace App\Services;

require __DIR__ . '/../Configuration/config.inc.php';

class ValidationService
{
    public function validateForm($fieldNames)
    {
        $errorMessages = [];
        $valid         = true;
        $filter        = $GLOBALS['settings']['backendValidation'];
        $pattern       = '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/';

        foreach ($fieldNames as $key => $value) {
            if (!empty($value)) {
                switch ($filter[$key]['mode']) {
                    case 'username' === $filter[$key]['mode'] && preg_match('/^[a-zA-Z0-9_äÄöÖüÜß.!?,\\ ]*$/', $value):
                        break;
                    // case 'password' === $filter[$key]['mode'] && preg_match($pattern, $value):
                    //     break;
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