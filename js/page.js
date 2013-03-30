window.Slapdash = window.Slapdash || {};
Slapdash.Page = {
    
    display: function(){
        // Choose dashboard
        var dashboard = $.url().param('dashboard');
        if (!dashboard){
            Slapdash.Page.showSelector();
        }
        else {
            // Draw dashboard
            Slapdash.Page.showDashboard(dashboard);
        }
    },
    
    showSelector: function(){
        var $container = $('<div>').addClass('container'),
            $list = $list = $('<ul>'),
            dashboardKey,
            dashboard;
        $container.append('<p>Select a dashboard:</p>').append($list);
        for(dashboardKey in Slapdash.Config._values.dashboards){
            dashboard = Slapdash.Config._values.dashboards[dashboardKey];
            $list.append($('<li>').append($('<a>').attr('href','?dashboard='+dashboardKey).text(dashboard.name)));
        }
        $('body').prepend($container);
    },
    
    showDashboard: function(dashboardKey){
        Slapdash.Page._buildDashboard(dashboardKey);
        Slapdash.Page._drawDashboard();
        
        var refresh = Slapdash.Config._values.dashboards[dashboardKey].refresh;
        if (refresh){
            window.setInterval(Slapdash.Page._drawDashboard, refresh*1000);
        }
    },
    
    _buildDashboard: function(dashboardKey){
        var $container = $container = $('<div>').addClass('container'),
            dashboard = Slapdash.Config._values.dashboards[dashboardKey],
            rowIndex,
            row,
            $dashRow,
            layout,
            layoutElementIndex,
            layoutElement,
            graph,
            graphUrl,
            $dashGraph,
            $dashGraphImg;
        
        for(rowIndex in dashboard.rows){
            row = dashboard.rows[rowIndex];
            $dashRow = $('<div class="row">');
            layout = Slapdash.Config._values.layouts[row.layout];
            for(layoutElementIndex in layout){
                layoutElement = layout[layoutElementIndex];
                graph = Slapdash.Config._values.graphs[row.graphs[layoutElementIndex]];
                graphUrl = Slapdash.Util.getUrl(graph,layoutElement);
                $dashGraphImg = $('<img>')
                    .data('url',graphUrl)
                    .attr('width',Slapdash.Util.getSize(layoutElement[0]))
                    .attr('height',Slapdash.Util.getSize(layoutElement[1]));
                $dashGraph = $('<div class="graph">')
                    .attr('id', dashboardKey + "-" + rowIndex + "-" + layoutElementIndex)
                    .addClass('span' + layoutElement[0])
                    .addClass('height' + layoutElement[1])
                    .append($dashGraphImg);
                $dashRow.append($dashGraph);
            }
            $container.append($dashRow);
        }
        $('body').prepend($container).css('background-color',dashboard.background);
        $('title').text(dashboard.name + ' - ' + $('title').text());
    },
        
    _drawDashboard: function(){
        var ts = Date.now(),
            $dashGraphImg
        $(".graph img").each(function(index, graphImg){
            $dashGraphImg = $(graphImg);
            $dashGraphImg.attr('src',$dashGraphImg.data("url") + "&_ts=" + ts);
        });
    }

}