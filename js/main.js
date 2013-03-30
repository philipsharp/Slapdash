$(function(){
    $.ajaxSetup({cache:false});
    
    // Load configuration
    Slapdash.Config.load().then(function(){
        Slapdash.Util.debug('Config loaded: ' + JSON.stringify(Slapdash.Config._values));
        // Show current page
        Slapdash.Page.display();
   });
   
});
