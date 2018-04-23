angular.module('mainController',['authServices'])
.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window, $interval){

 var app = this;
    
app.loadme = false;

   
app.checkSession = function(){
    if(Auth.isLoggedIn()){
        app.checkingSession = true;
        var interval = $interval(function(){
            var token = $window.localStorage.getItem('token');
            if (token === null) {
                $interval.cancel(interval);
            }else{
                self.parseJwt = function(token){
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace('-','+').replace('_','/');
                    return JSON.parse($window.atob(base64));
                }
                
                var expireTime = self.parseJwt(token);
                var timeStamp = Math.floor(Date.now() / 1000);
                console.log(expireTime.exp);
                console.log(timeStamp);

                var timeCheck = expireTime.exp - timeStamp;
                console.log('timeCheck: '+ timeCheck);

                if (timeCheck<=0) {
                    console.log('token has expired');
                    showModal();
                    $interval.cancel(interval);
                }else{
                    console.log('token not yet expired');
                }
            }

        }, 2000);
    }
};

app.checkSession();

var showModal = function() {

    app.choiceMade = false;
    app.modalHeader = 'Timout Warning';
    app.modalBody = 'Your session will expired in 5 minutes, Would you like to renew your session';
    $('#myModal').modal({ backdrop: "static" });

    $timeout(function() {
        if (!app.choiceMade) {
            console.log('Logged Out!!!');
        }
    }, 4000);
};

app.renewSession = function() {

    app.choiceMade = true;
    console.log('session has renewed');
};

app.endSession = function() {

    app.choiceMade = true;
    console.log('session has been ended');
};
    
    $rootScope.$on('$routeChangeStart', function(){
        
        if(!app.checkSession) app.checkSession();

        if(Auth.isLoggedIn()){
        console.log('Success: user is logged in.');
        app.isLoggedIn = true;    
        Auth.getUser().then(function(data){
            console.log(data.data.username);
            app.username = data.data.username;
            app.useremail = data.data.email;
            
            app.loadme = true;
        });
    }else{
       console.log('Failure: user is not logged in.'); 
        app.isLoggedIn = false; 
        app.username = '';
         app.loadme = true;
    }
        
    })
   
    
     this.doLogin = function(loginData){
         app.loading = true;
        app.errorMsg = false;
         
        
        
        Auth.login(app.loginData).then(function(data){
            if(data.data.success){
                  //success message
                app.loading = false;
                 app.successMsg = data.data.message + '... Redirecting';
                $timeout(function(){
                    $location.path('/');
                    app.loginData = '';
                    app.successMsg = false;
                    app.disabled = false;
                    app.checkSession();
                }, 2000);
               
            }else{
                //error message
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
         
    };
    
    this.logout = function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function() {
            $location.path('/');      
        }, 2000);
    };
    
});







