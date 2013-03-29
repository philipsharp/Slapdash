$(function(){
    $.ajaxSetup({cache:false});
    
    // Load configuration
    Slapdash.Config.load().then(function(){
        Slapdash.Util.debug('Config loaded: ' + JSON.stringify(Slapdash.Config._values));
 
        // Choose dashboard
        var dashboard = Slapdash.Page.getCurrent();
        if (!dashboard){
            Slapdash.Page.showSelector();
        }
        else {
            // Draw dashboard
            Slapdash.Page.showDashboard(dashboard);
        }
   });
   
});
