<?php

namespace App\Services;

class SessionService
{
    public function manageSession()
    {
        $timeout = 86400 * 7;

        if (isset($_COOKIE['session'])) {
            session_id($_COOKIE['session']);
            $this->startSession($timeout);

            $_SESSION['ipAddress'] = $_SERVER['REMOTE_ADDR'];
            $_SESSION['userAgent'] = $_SERVER['HTTP_USER_AGENT'];

            if (!$this->secureSession($_SESSION['ipAddress'], $_SESSION['userAgent'])) {
                session_unset();
                session_destroy();

                $this->startSession($timeout);
                $this->setCookieDetails($timeout);
            }
        } else {
            $this->startSession($timeout);
            $this->setCookieDetails($timeout);
        }

        if (!isset($_SESSION['lastVisit'])) {
            $_SESSION['lastVisit'] = time();
        }

        if (!isset($_SESSION['user'])) {
            $_SESSION['user'] = null;
        }

        if ((time() - $_SESSION['lastVisit']) > $timeout) {
            unset($_COOKIE['session']);
            session_destroy();
            $this->startSession($timeout);
            $this->setCookieDetails($timeout);
        }
        $_SESSION['lastVisit'] = time();
        setcookie('session', session_id(), time() + $timeout);
    }

    private function startSession($timeout)
    {
        ini_set('session.use_cookies', '0');
        ini_set('session.gc_maxlifetime', $timeout);
        session_start();
    }

    private function secureSession($ipAddress, $userAgent)
    {
        $secure = true;

        if ($_SERVER['REMOTE_ADDR'] != $ipAddress || $_SERVER['HTTP_USER_AGENT'] != $userAgent) {
            $secure = false;
        }

        return $secure;
    }

    private function setCookieDetails($timeout)
    {
        setcookie('session', session_id(), time() + $timeout);

        $_SESSION['ipAddress']    = $_SERVER['REMOTE_ADDR'];
        $_SESSION['userAgent']    = $_SERVER['HTTP_USER_AGENT'];
        $_SESSION['user']         = null;
    }
}