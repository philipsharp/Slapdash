$(function(){
    $.ajaxSetup({cache:false});
    
    // Load configuration
    Dashboard.Config.load().then(function(){
        Dashboard.Util.debug('Config loaded: ' + JSON.stringify(Dashboard.Config._values));
 
        // Choose dashboard
        var dashboard = Dashboard.Page.getCurrent();
        if (!dashboard){
            Dashboard.Page.showSelector();
        }
        else {
            // Draw dashboard
            Dashboard.Page.showDashboard(dashboard);
        }
   });
   
});
