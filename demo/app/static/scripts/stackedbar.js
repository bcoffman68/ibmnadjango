function  BrunelVis(visId) {
  "use strict";                                                                       // strict mode
  var datasets = [],                                      // array of datasets for the original data
      pre = function(d, i) { return d },                         // default pre-process does nothing
      post = function(d, i) { return d },                       // default post-process does nothing
      transitionTime = 200,                                        // transition time for animations
      charts = [],                                                       // the charts in the system
      vis = d3.select('#' + visId).attr('class', 'brunel');                     // the SVG container

  BrunelD3.addDefinitions(vis);                                   // ensure standard symbols present

  // Define chart #1 in the visualization //////////////////////////////////////////////////////////

  charts[0] = function(parentNode, filterRows) {
    var geom = BrunelD3.geometry(parentNode || vis.node(), 0, 0, 1, 1, 5, 43, 37, 66),
      elements = [];                                              // array of elements in this chart

    // Define groups for the chart parts ///////////////////////////////////////////////////////////

    var chart =  vis.append('g').attr('class', 'chart1')
      .attr('transform','translate(' + geom.chart_left + ',' + geom.chart_top + ')');
    var overlay = chart.append('g').attr('class', 'element').attr('class', 'overlay');
    var zoom = d3.zoom().scaleExtent([1/3,3]);
    var zoomNode = overlay.append('rect').attr('class', 'overlay')
      .attr('x', geom.inner_left).attr('y', geom.inner_top)
      .attr('width', geom.inner_rawWidth).attr('height', geom.inner_rawHeight)
      .style('cursor', 'move').call(zoom)
      .node();
    zoomNode.__zoom = d3.zoomIdentity;
    chart.append('rect').attr('class', 'background').attr('width', geom.chart_right-geom.chart_left).attr('height', geom.chart_bottom-geom.chart_top);
    var interior = chart.append('g').attr('class', 'interior zoomNone')
      .attr('transform','translate(' + geom.inner_left + ',' + geom.inner_top + ')')
      .attr('clip-path', 'url(#clip_visualization_chart1_inner)');
    interior.append('rect').attr('class', 'inner').attr('width', geom.inner_width).attr('height', geom.inner_height);
    var gridGroup = interior.append('g').attr('class', 'grid');
    var axes = chart.append('g').attr('class', 'axis')
      .attr('transform','translate(' + geom.inner_left + ',' + geom.inner_top + ')');
    var legends = chart.append('g').attr('class', 'legend')
      .attr('transform','translate(' + (geom.chart_right-geom.chart_left - 3) + ',' + 0 + ')');
    vis.append('clipPath').attr('id', 'clip_visualization_chart1_inner').append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', geom.inner_rawWidth+1).attr('height', geom.inner_rawHeight+1);

    // Scales //////////////////////////////////////////////////////////////////////////////////////

    var scale_x = d3.scalePoint().padding(0.5)
      .domain(['Hero1', 'Hero2', 'Hero3'])
      .range([0, geom.inner_width]);
    var scale_inner = d3.scaleLinear().domain([0,1])
      .range([-0.5, 0.5]);
    var scale_y = d3.scaleLinear().domain([0, 1.0000001])
      .range([geom.inner_height, 0]);
    var base_scales = [scale_x, scale_y];                           // untransformed original scales

    // Axes ////////////////////////////////////////////////////////////////////////////////////////

    axes.append('g').attr('class', 'x axis')
      .attr('transform','translate(0,' + geom.inner_rawHeight + ')')
      .attr('clip-path', 'url(#clip_visualization_chart1_haxis)');
    vis.append('clipPath').attr('id', 'clip_visualization_chart1_haxis').append('polyline')
      .attr('points', '-1,-1000, -1,-1 -5,5, -1000,5, -100,1000, 10000,1000 10000,-1000');
    axes.select('g.axis.x').append('text').attr('class', 'title').text('Super Hero').style('text-anchor', 'middle')
      .attr('x',geom.inner_rawWidth/2)
      .attr('y', geom.inner_bottom - 2.0).attr('dy','-0.27em');
    axes.append('g').attr('class', 'y axis')
      .attr('clip-path', 'url(#clip_visualization_chart1_vaxis)');
    vis.append('clipPath').attr('id', 'clip_visualization_chart1_vaxis').append('polyline')
      .attr('points', '-1000,-10000, 10000,-10000, 10000,' + (geom.inner_rawHeight+1) + ', -1,' + (geom.inner_rawHeight+1) + ', -1,' + (geom.inner_rawHeight+5) + ', -1000,' + (geom.inner_rawHeight+5) );
    axes.select('g.axis.y').append('text').attr('class', 'title').text('Sum(Pct)').style('text-anchor', 'middle')
      .attr('x',-geom.inner_rawHeight/2)
      .attr('y', 4-geom.inner_left).attr('dy', '0.7em').attr('transform', 'rotate(270)');

    var axis_bottom = d3.axisBottom(scale_x).ticks(Math.min(10, Math.round(geom.inner_width / 49.5)));
    var axis_left = d3.axisLeft(scale_y).ticks(Math.min(10, Math.round(geom.inner_width / 20)));

    function buildAxes(time) {
      axis_bottom.tickValues(BrunelD3.filterTicks(scale_x))
      var axis_x = axes.select('g.axis.x');
      BrunelD3.transition(axis_x, time).call(axis_bottom.scale(scale_x));
      var axis_y = axes.select('g.axis.y');
      BrunelD3.transition(axis_y, time).call(axis_left.scale(scale_y));
    }
    zoom.on('zoom', function(t, time) {
        t = t ||BrunelD3.restrictZoom(d3.event.transform, geom, this);
        scale_y = t.rescaleY(base_scales[1]);
        zoomNode.__zoom = t;
        interior.attr('class', 'interior ' + BrunelD3.zoomLabel(t.k));;
        build(time || -1);
    });

    // Define element #1 ///////////////////////////////////////////////////////////////////////////

    elements[0] = function() {
      var original, processed,                           // data sets passed in and then transformed
        element, data,                                 // brunel element information and brunel data
        selection, merged;                                      // d3 selection and merged selection
      var elementGroup = interior.append('g').attr('class', 'element1'),
        main = elementGroup.append('g').attr('class', 'main'),
        labels = BrunelD3.undoTransform(elementGroup.append('g').attr('class', 'labels').attr('aria-hidden', 'true'), elementGroup);

      function makeData() {
        original = datasets[0];
        if (filterRows) original = original.retainRows(filterRows);
        processed = pre(original, 0)
          .summarize('Pct=Pct:sum; Super_Hero=Super_Hero:base; WL=WL')
          .stack('Pct; Super_Hero; WL; false');
        processed = post(processed, 0);
        var f0 = processed.field('Pct$lower'),
          f1 = processed.field('Pct$upper'),
          f2 = processed.field('Super_Hero'),
          f3 = processed.field('Pct'),
          f4 = processed.field('WL'),
          f5 = processed.field('#row'),
          f6 = processed.field('#selection');
        var keyFunc = function(d) { return f2.value(d)+ '|' + f4.value(d) };
        data = {
          Pct$lower:    function(d) { return f0.value(d.row) },
          Pct$upper:    function(d) { return f1.value(d.row) },
          Super_Hero:   function(d) { return f2.value(d.row) },
          Pct:          function(d) { return f3.value(d.row) },
          WL:           function(d) { return f4.value(d.row) },
          $row:         function(d) { return f5.value(d.row) },
          $selection:   function(d) { return f6.value(d.row) },
          Pct$lower_f:  function(d) { return f0.valueFormatted(d.row) },
          Pct$upper_f:  function(d) { return f1.valueFormatted(d.row) },
          Super_Hero_f: function(d) { return f2.valueFormatted(d.row) },
          Pct_f:        function(d) { return f3.valueFormatted(d.row) },
          WL_f:         function(d) { return f4.valueFormatted(d.row) },
          $row_f:       function(d) { return f5.valueFormatted(d.row) },
          $selection_f: function(d) { return f6.valueFormatted(d.row) },
          _split:       function(d) { return f4.value(d.row) },
          _key:         keyFunc,
          _rows:        BrunelD3.makeRowsWithKeys(keyFunc, processed.rowCount())
        };
      }
      // Aesthetic Functions
      var scale_color = d3.scaleOrdinal()
        .domain(['Loss', 'Win'])
        .range([ '#347DAD', '#D43F58', '#F7D84A', '#31A461', '#A66A9C', '#FF954D',
          '#A7978E', '#FFCA4D', '#F99EAF', '#B1C43B', '#7E64A2', '#FFB04D', '#CA5C7C',
          '#DDBC8C', '#FFA28D', '#A5473D', '#8B6141', '#F57357', '#5C6B46']);
      var color = function(d) { return scale_color(data.WL(d)) };
      legends._legend = legends._legend || { title: ['Win Loss '],
        ticks: scale_color.domain()};
      legends._legend.color = scale_color;

      // Build element from data ///////////////////////////////////////////////////////////////////

      function build(transitionMillis) {
        element = elements[0];
        var w = 0.9 * Math.abs(scale_x(scale_x.domain()[1]) - scale_x(scale_x.domain()[0]) );
        var x = function(d) { return scale_x(data.Super_Hero(d))};
        var h = Math.abs( scale_y(scale_y.domain()[0] + 0.04999999999999999) - scale_y.range()[0] );
        var y1 = function(d) { return scale_y(data.Pct$lower(d))};
        var y2 = function(d) { return scale_y(data.Pct$upper(d))};
        var y = function(d) { return scale_y( (data.Pct$upper(d) + data.Pct$lower(d) )/2)};

        // Define selection entry operations
        function initialState(selection) {
          selection
            .attr('class', 'element bar filled')
            .style('pointer-events', 'none')
        }

        // Define selection update operations on merged data
        function updateState(selection) {
          selection
            .each(function(d) {
              var width = w, left = x(d) - width/2,
              c = y1(d), d = y2(d), top = Math.min(c,d), height = Math.max(1e-6, Math.abs(c-d));
              this.r = {x:left, y:top, w:width, h:height};
            })
            .attr('x', function(d) { return this.r.x })
            .attr('y', function(d) { return this.r.y })
            .attr('width', function(d) { return this.r.w })
            .attr('height', function(d) { return this.r.h })
            .filter(BrunelD3.hasData)                     // following only performed for data items
            .style('fill', color);
        }

        // Define labeling for the selection
        function label(selection, transitionMillis) {
        }
        // Create selections, set the initial state and transition updates
        selection = main.selectAll('.element').data(data._rows, function(d) { return d.key });
        var added = selection.enter().append('rect');
        merged = selection.merge(added);
        initialState(added);
        selection.filter(BrunelD3.hasData)
          .classed('selected', BrunelD3.isSelected(data))
          .filter(BrunelD3.isSelected(data)).raise();
        updateState(BrunelD3.transition(merged, transitionMillis));

        BrunelD3.transition(selection.exit(), transitionMillis/3)
          .style('opacity', 0.5).each( function() {
            this.remove(); BrunelD3.removeLabels(this);
        });
      }

      return {
        data:           function() { return processed },
        original:       function() { return original },
        internal:       function() { return data },
        selection:      function() { return merged },
        makeData:       makeData,
        build:          build,
        chart:          function() { return charts[0] },
        group:          function() { return elementGroup },
        fields: {
          x:            ['Super_Hero'],
          y:            ['Pct'],
          key:          ['Super_Hero', 'WL'],
          color:        ['WL']
        }
      };
    }();

    function build(time, noData) {
      var first = elements[0].data() == null;
      if (first) time = 0;                                           // no transition for first call
      buildAxes(time);
      if ((first || time > -1) && !noData) {
        elements[0].makeData();
        BrunelD3.addLegend(legends, legends._legend);
      }
      elements[0].build(time);
    }

    // Expose the following components of the chart
    return {
      elements : elements,
      interior : interior,
      scales: {x:scale_x, y:scale_y},
      zoom: function(params, time) {
          if (params) zoom.on('zoom').call(zoomNode, params, time);
          return d3.zoomTransform(zoomNode);
      },
      build : build
    };
    }();

  function setData(rowData, i) { datasets[i||0] = BrunelD3.makeData(rowData) }
  function updateAll(time) { charts.forEach(function(x) {x.build(time || 0)}) }
  function buildAll() {
    for (var i=0;i<arguments.length;i++) setData(arguments[i], i);
    updateAll(transitionTime);
  }

  return {
    dataPreProcess:     function(f) { if (f) pre = f; return pre },
    dataPostProcess:    function(f) { if (f) post = f; return post },
    data:               function(d,i) { if (d) setData(d,i); return datasets[i||0] },
    visId:              visId,
    build:              buildAll,
    rebuild:            updateAll,
    charts:             charts
  }
}

// Data Tables /////////////////////////////////////////////////////////////////////////////////////

var table1 = {
   summarized: true,
   names: ['Super_Hero', 'Pct', 'WL'],
   options: ['string', 'numeric', 'string'],
   rows: [['Hero1', 0.7, 'Loss'], ['Hero1', 0.3, 'Win'], ['Hero2', 0.75, 'Loss'],
  ['Hero2', 0.25, 'Win'], ['Hero3', 0.9, 'Loss'], ['Hero3', 0.1, 'Win']]
};

// Call Code to Build the system ///////////////////////////////////////////////////////////////////

var v  = new BrunelVis('visualization');
v.build(table1);
