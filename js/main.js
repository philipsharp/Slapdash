$(function(){
    $.ajaxSetup({cache:false});
    
    // Load configuration
    Slapdash.Config.load().then(function(){
        Slapdash.Util.debug('Graphs: ' + JSON.stringify(Slapdash.Config.graphs));
        Slapdash.Util.debug('Dashboard: ' + JSON.stringify(Slapdash.Config.dashboards));
        // Show current page
        Slapdash.Page.display();
   });
   
});
