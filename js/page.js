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
        var $container = $('#main'),
            $list = $('<ul>'),
            dashboardKey,
            dashboard;
        $container.append('<p>Select a dashboard:</p>').append($list);
        for(dashboardKey in Slapdash.Config.dashboards){
            dashboard = Slapdash.Config.dashboards[dashboardKey];
            $list.append($('<li>').append($('<a>').attr('href','?dashboard='+dashboardKey).text(dashboard.name)));
        }
        $('body').prepend($container);
    },
    
    showDashboard: function(dashboardKey){
        Slapdash.Page._calculateStyles();
        Slapdash.Page._buildDashboard(dashboardKey);
        Slapdash.Page._drawDashboard();
        
        var refresh = Slapdash.Config.dashboards[dashboardKey].refresh;
        if (refresh){
            window.setInterval(Slapdash.Page._drawDashboard, refresh*1000);
        }
    },
    
    _calculateStyles: function(){
        // 47 = 12*3 (columns)  + 11 (gutters)
        var bodyWidth = $('body').width(),
            widthTarget = Math.max(940,bodyWidth - 20),
            baseUnit = Math.floor(widthTarget/47),
            mainWidth = baseUnit * 47,
            spanSize = baseUnit * 3,
            spanMargin = baseUnit;
        
        Slapdash.Config.mainWidth = mainWidth;
        Slapdash.Config.spanSize = spanSize;
        Slapdash.Config.spanMargin = spanMargin;
        
        $('head').append('<style type="text/css">' +
            '.container { width: ' + mainWidth + 'px; }' +
            '[class*="width"] { margin-left: ' + spanMargin + 'px; }' +
            '.row { margin-left: -' + spanMargin + 'px; }' +
            '.graph { margin-bottom: ' + spanMargin + 'px; }' +
            '.width1 { width: ' + spanSize + 'px; }' +  
            '.width2 { width: ' + (spanSize * 2 + spanMargin) + 'px; }' +
            '.width3 { width: ' + (spanSize * 3 + spanMargin * 2) + 'px; }' +
            '.width4 { width: ' + (spanSize * 4 + spanMargin * 3) + 'px; }' +
            '.width5 { width: ' + (spanSize * 5 + spanMargin * 4) + 'px; }' +
            '.width6 { width: ' + (spanSize * 6 + spanMargin * 5) + 'px; }' +
            '.width7 { width: ' + (spanSize * 7 + spanMargin * 6) + 'px; }' +
            '.width8 { width: ' + (spanSize * 8 + spanMargin * 7) + 'px; }' +
            '.width9 { width: ' + (spanSize * 9 + spanMargin * 8) + 'px; }' +
            '.width10 { width: ' + (spanSize * 10 + spanMargin * 9) + 'px; }' +
            '.width11 { width: ' + (spanSize * 11 + spanMargin * 10) + 'px; }' +
            '.width12 { width: ' + (spanSize * 12 + spanMargin * 11) + 'px; }' +
            '.height1 { height: ' + spanSize + 'px; }' +  
            '.height2 { height: ' + (spanSize * 2 + spanMargin) + 'px; }' +
            '.height3 { height: ' + (spanSize * 3 + spanMargin * 2) + 'px; }' +
            '.height4 { height: ' + (spanSize * 4 + spanMargin * 3) + 'px; }' +
            '.height5 { height: ' + (spanSize * 5 + spanMargin * 4) + 'px; }' +
            '.height6 { height: ' + (spanSize * 6 + spanMargin * 5) + 'px; }' +
            '.height7 { height: ' + (spanSize * 7 + spanMargin * 6) + 'px; }' +
            '.height8 { height: ' + (spanSize * 8 + spanMargin * 7) + 'px; }' +
            '.height9 { height: ' + (spanSize * 9 + spanMargin * 8) + 'px; }' +
            '.height10 { height: ' + (spanSize * 10 + spanMargin * 9) + 'px; }' +
            '.height11 { height: ' + (spanSize * 11 + spanMargin * 10) + 'px; }' +
            '.height12 { height: ' + (spanSize * 12 + spanMargin * 11) + 'px; }' +
            '</style>');
    },
    
    _buildDashboard: function(dashboardKey){
        var $container = $('#main'),
            dashboard = Slapdash.Config.dashboards[dashboardKey],
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
            layout = Slapdash.Config.layouts[row.layout];
            for(layoutElementIndex in layout){
                layoutElement = layout[layoutElementIndex];
                graph = Slapdash.Config.graphs[row.graphs[layoutElementIndex]];
                graphUrl = Slapdash.Util.getUrl(graph,layoutElement);
                $dashGraphImg = $('<img>')
                    .data('url',graphUrl)
                    .attr('width',Slapdash.Util.getSize(layoutElement[0]))
                    .attr('height',Slapdash.Util.getSize(layoutElement[1]));
                $dashGraph = $('<div class="graph">')
                    .attr('id', dashboardKey + "-" + rowIndex + "-" + layoutElementIndex)
                    .addClass('width' + layoutElement[0])
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