<!DOCTYPE html>

<html lang="en">
<head>

    <title>Login | Anggota APMI</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="" name="description" />
    <meta content="" name="author" />
    <!-- App favicon -->
    <link rel="shortcut icon" href="assets/images/bg/APMI.png">
    <!-- preloader css -->
    <link rel="stylesheet" href="assets/css/preloader.min.css" type="text/css" />

    <!-- Bootstrap Css -->
    <link href="assets/css/bootstrap-dason.min.css" id="bootstrap-style" rel="stylesheet" type="text/css" />
    <!-- Icons Css -->
    <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <!-- App Css-->
    <link href="assets/css/app-dason.css" id="app-style" rel="stylesheet" type="text/css" />
    
    <style>
        html {
            background-color: #DDE0E8 !important;
        }

        body {
            background-color: transparent !important;
        }

        .border-left-login {
            border-left: 4px solid #0e3394;
            border-radius: 9px;
        }

        .bg-btn-login {
            background-color: #0e3394 !important;
        }

        .formLogin {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }

        .formGate {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }

        .formRight {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }
    </style>
    <style>
        .auth-bg {
            background-image: url("assets/images/bg/ged.jpeg");
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            filter: brightness(50%);
        }

        .auth-bg .bg-overlay {
            background: -webkit-gradient(linear, left top, left bottom, color-stop(30%, rgba(43, 57, 64, .5)), to(#2b3940));
            background: linear-gradient(to bottom, rgba(43, 57, 64, .5) 30%, #2b3940 100%);
            opacity: 1
            
        }

        @media (min-width:768px) {
            .auth-bg {
                height: 100%
            }
        }        

        #rightSide {
            display: block;
        }

        @media (min-width: 320px) and (max-width: 767px) {
            #rightSide {
                display: none;
            }
        }

        @media (min-width: 0px) and (max-width: 320px) {
            #rightSide {
                display: none;
            }
        }

        @media (max-width: 1199px) {
            #rightSide {
                display: none;
            }
        }
    </style>
</head>

<body>
    <div class="auth-page mt-0 mt-md-0 mb-5 pt-3 pt-md-5">
        <div class="container p-0 sbox-border">
            <div class="row g-0">
                <div class="col-xl-5" id="leftSide">
                    
                    <div class="auth-full-page-content d-flex px-5 py-4 formLogin">
                        <div class="w-100">
                            <div class="d-flex flex-column h-100">
                                <div class="mb-4 mt-2 text-center">
                                    <a href="login.html" class="d-block auth-logo mb-3">
                                        <img src="assets/images/bg/APMI.png" alt="" height="72">
                                    </a>
                                </div>
                                <div class="auth-content my-auto">
                                    <div class="text-center">
                                        <h5 class="mb-0">Asosiasi Peneliti Muda Indonesia</h5>
                                        <p class="text-muted mt-2">Login untuk melanjutkan ke aplikasi.</p>
                                    </div>
 
                                    	
                                    @if (session()->has('loginError'))
                                    <div class="allert allert-danger allert-dismissible fade show" role="alert">
                                        {{session('loginError')}}

                                    </div>
                                    @endif
                                        
            
                                    <form action="/login" method="post" accept-charset="utf-8">
                                        @csrf
                                         <div class="form-floating border-left-login form-floating-custom mb-3">
                                            <input type="email" class="form-control " id="email" name="email"
                                                placeholder="Masukkan Email" required>
                                            <label for="basic_name">Email</label>
                                            <div class="form-floating-icon">
                                                <i data-feather="users"></i>
                                            </div>
                                        </div>
                                        
                                        
                                        <div class="form-floating border-left-login form-floating-custom mb-4 auth-pass-inputgroup">
                                            <input type="password" class="form-control pe-5" id="password"
                                                name="password" placeholder="Enter Password">

                                            <button type="button"
                                                class="btn btn-link position-absolute h-100 end-0 top-0"
                                                id="password-addon">
                                                <i class="mdi mdi-eye-outline font-size-18 text-muted"></i>
                                            </button>
                                            <label for="basic_password">Password</label>
                                            <div class="form-floating-icon">
                                                <i data-feather="lock"></i>
                                            </div>
                                        </div>

                                        <div class="row mb-4">
                                            <div class="col">
                                                <div class="form-check font-size-15">
                                                    <input class="form-check-input" type="checkbox" id="remember-check">
                                                    <label class="form-check-label font-size-13" for="remember-check">
                                                        Ingat Saya
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="col">
                                                
                                                
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <button class="btn btn-primary bg-btn-login w-100 waves-effect waves-light"
                                                style="font-weight: bold;" type="submit">
                                                Log In
                                            </button>
                                        </div>
                                    </form>
                                    
                                </div>
                                <div class="mt-4 text-center">
                                    <p class="mb-0">© <script>
                                            document.write(new Date().getFullYear())
                                        </script> Dibuat oleh <b>Irvan Nurfauzan Saputra</b>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end auth full page content -->
                </div>
                <!-- end col -->
                <div class="col-xl-7" id="rightSide">
                    <div class="auth-full-page-content formRight">
                        <div class="w-100 h-100">
                            <div class="auth-bg pt-md-5 p-4 d-flex formRight">                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end row -->
        </div>
        <!-- end container fluid -->
    </div>

    <script src="assets/libs/jquery/jquery.min.js"></script>
    <script src="assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="assets/libs/metismenu/metisMenu.min.js"></script>1
    <script src="assets/libs/simplebar/simplebar.min.js"></script>
    <script src="assets/libs/node-waves/waves.min.js"></script>
    <script src="assets/libs/feather-icons/feather.min.js"></script>
    <!-- pace js -->
    <script src="assets/libs/pace-js/pace.min.js"></script>

    <script src="assets/js/app-dason.js"></script>
    <script src="../unpkg.com/just-validate%404.3.0/dist/just-validate.production.min.js"></script>
    <script>
        $(document).ready(function () {})
    </script>
    <script>
        const validator = new JustValidate('#validate');

        validator
        .addField('#basic_name', [
            {
            rule: 'required',
            },
            {
            rule: 'minLength',
            value: 4,
            },
        ])
        .addField('#basic_password', [
            {
            rule: 'required',
            },
            {
            rule: 'password',
            },
        ]);
    </script>

</body>
</html>