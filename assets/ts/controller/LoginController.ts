export class LoginController {
    private passwordInput: HTMLInputElement | null;
    private confirmPasswordInput: HTMLInputElement | null;
    private registerButton: HTMLButtonElement | null;
    private registerForm: HTMLFormElement | null;
    private passwordFeedback: HTMLElement | null;
    private readonly passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_.,]).{8,}$/;

    init() {
        this.passwordInput = document.querySelector('#register-tab input[name="password"]');
        this.confirmPasswordInput = document.querySelector('#register-tab input[name="passwordConfirm"]');
        this.registerButton = document.querySelector('#register-tab button[type="submit"]');
        this.registerForm = document.querySelector('#register-tab form');
        this.passwordFeedback = document.querySelector('#password-requirements');

        // Add focus/blur event listeners
        this.passwordInput?.addEventListener('focus', () => {
            this.passwordFeedback?.classList.remove('d-none');
        });

        this.passwordInput?.addEventListener('blur', () => {
            this.passwordFeedback?.classList.add('d-none');
        });

        this.setupPasswordToggles();
        this.setupPasswordValidation();
        this.setupFormValidation();
    }

    private setupPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.password-toggle');

        toggleButtons.forEach(button => {
            const icon = button.querySelector('i');
            // Set initial state to closed eye
            icon?.classList.remove('fa-eye');
            icon?.classList.add('fa-eye-slash');

            button.addEventListener('click', (e) => {
                const btn = e.currentTarget as HTMLElement;
                const input = btn.previousElementSibling as HTMLInputElement;
                const icon = btn.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon?.classList.remove('fa-eye-slash');
                    icon?.classList.add('fa-eye');
                } else {
                    input.type = 'password';
                    icon?.classList.remove('fa-eye');
                    icon?.classList.add('fa-eye-slash');
                }
            });
        });
    }

    private validatePasswordStrength(password: string): boolean {
        return this.passwordRegex.test(password);
    }

    private updatePasswordFeedback(password: string) {
        if (!this.passwordFeedback) return;

        const requirements = [
            { regex: /.{8,}/, text: '8+ Zeichen' },
            { regex: /(?=.*[A-Z])/, text: 'Großbuchstabe' },
            { regex: /(?=.*[a-z])/, text: 'Kleinbuchstabe' },
            { regex: /(?=.*[0-9])/, text: 'Zahl' },
            { regex: /(?=.*[#?!@$%^&*\-_.,])/, text: 'Sonderzeichen' }
        ];

        const html = requirements.map(req => {
            const isValid = req.regex.test(password);
            return `<span class="requirement ${isValid ? 'text-success' : 'text-muted'}">
                <i class="fas fa-${isValid ? 'check' : 'circle'} me-1"></i>${req.text}
            </span>`;
        }).join(' ');

        this.passwordFeedback.innerHTML = html;
    }

    private setupPasswordValidation() {
        if (!this.passwordInput || !this.confirmPasswordInput || !this.registerButton) return;

        const validatePasswords = () => {
            const password = this.passwordInput?.value || ''; // Default to empty string
            const confirmPassword = this.confirmPasswordInput?.value;

            // Always update feedback, even for empty password
            this.updatePasswordFeedback(password);

            if (password) {
                if (!this.validatePasswordStrength(password)) {
                    this.passwordInput.classList.add('is-invalid');
                    this.registerButton?.setAttribute('disabled', 'true');
                } else {
                    this.passwordInput.classList.remove('is-invalid');
                }
            } else {
                // Reset validation state when password is empty
                this.passwordInput.classList.remove('is-invalid');
                this.registerButton?.setAttribute('disabled', 'true');
            }

            if (password && confirmPassword) {
                if (password !== confirmPassword) {
                    this.confirmPasswordInput?.classList.add('is-invalid');
                    this.registerButton?.setAttribute('disabled', 'true');
                } else {
                    this.confirmPasswordInput?.classList.remove('is-invalid');
                    if (this.validatePasswordStrength(password)) {
                        this.registerButton?.removeAttribute('disabled');
                    }
                }
            }
        };

        this.passwordInput.addEventListener('input', validatePasswords);
        this.confirmPasswordInput.addEventListener('input', validatePasswords);
    }

    private setupFormValidation() {
        if (!this.registerForm) return;

        this.registerForm.addEventListener('submit', (e) => {
            if (!this.passwordInput || !this.confirmPasswordInput) return;

            const password = this.passwordInput.value;

            if (!this.validatePasswordStrength(password)) {
                e.preventDefault();
                this.passwordInput.classList.add('is-invalid');
                return;
            }

            if (password !== this.confirmPasswordInput.value) {
                e.preventDefault();
                this.confirmPasswordInput.classList.add('is-invalid');
            }
        });
    }
}