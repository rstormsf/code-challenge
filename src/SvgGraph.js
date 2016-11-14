import React, { Component, PropTypes } from 'react';

import { scaleBand, scaleLinear } from 'd3-scale';

class SvgGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tooltip: '', showTooltip: false,
      tooltipTransform: '',
    }
  }


  render() {
    let margin = { top:5, right:5, bottom:5, left:5 };

    const { data, order, legendData } = this.props;

    let w = this.props.width - (margin.left + margin.right);
    let h = this.props.height - (margin.top + margin.bottom);

    const transformUniques = `translate(${margin.left},${h/3}) scale(1,-1)`;
    const transformTotals = `translate(${margin.left},${h/3+20}) scale(1,1)`;

    let firstDate = data[0].date;
    let lastDate = data[data.length-1].date;

    let x = scaleBand().domain(
              data.map( (d) => d.date)
            )
            .paddingInner(0.15)
            .rangeRound([0, w]);

    let yDomainMax = Math.max.apply(null,
      data.map((d) => d.all_total)
    );


    let y = scaleLinear().domain([0, yDomainMax])
            .range([0, 2*h/3-40]);

    const mouseOver = (val, dataType, e) => {
      this.setState({ showTooltip: true, tooltip: `Value - ${val} ${dataType}` });
    };

    const mouseOut = (e) => {
      this.setState({ showTooltip: false });
    };

    const barGenerator = (d, type, keyn) => {
      const rects = [];
      let runningSum = 0;
      for(let j=0; j<order.length; j++) {
        let key = order[j];

        rects.push(
          <rect onMouseOver={(e) => mouseOver(d[`${key}_${type}`], legendData[key].desc, e)}
            onMouseOut={mouseOut}
            key={`${key}_${keyn}_${type}`}
            fill={legendData[key].color}
            y={runningSum}
            x={x(d.date)}
            width={x.bandwidth()}
            height={y(d[`${key}_${type}`])}
         />);
        runningSum += y(d[`${key}_${type}`]);
      }
      return rects;
    }

    let rectsUniques = (data).map(
      (d, i) => barGenerator(d, 'uniques', i)
    );

    let rectsTotals = (data).map(
      (d, i) => barGenerator(d, 'total', i)
    );


    let legend = [];
    const offset = 150;
    for (let i=0; i<order.length; i++) {
      let legendTransform = `translate(${margin.left+x(data[0].date)+offset*i},${h-15}) scale(1,1)`;
      let key = order[i];
      let legendDescription = legendData[key].desc;
      let color = legendData[key].color;
      legend.push(
        <g transform={legendTransform} key={`legend-${key}`}>
          <rect fill={color} width="20" height="20" />
          <text x="30" y="15">{legendDescription}</text>
         </g>
      );
    }

    return (
      <div className="Graph">
         <svg id={this.props.chartId} width={this.props.width}
              height={this.props.height}>
          <g transform={transformUniques}>
            {rectsUniques}
          </g>
          <g transform={`translate(${margin.left+x(firstDate)},${h/3+15})`}>
            <text x="0" y="0"  style={{fontSize: '12px'}}>
              {firstDate.toLocaleDateString('en-US')}
            </text>
          </g>
          <g transform={`translate(${margin.left},${h/3+15})`}>
            <text textAnchor="end" x={x(lastDate)+x.bandwidth()} y="0" style={{fontSize: '12px'}}>
              {lastDate.toLocaleDateString('en-US')}
            </text>
          </g>
          <g transform={transformTotals} opacity="0.5">
            {rectsTotals}
          </g>
          {legend}
          {
            this.state.showTooltip ?
            <g className="tooltip" transform={`translate(${x(firstDate)},${margin.top})`}>
                <text x="0" y="15" textAnchor="left"
                style={{fontSize: '12px', fontWeight: 'bold'}}>
                {this.state.tooltip}
              </text>
            </g>
            :
            null
          }
        </svg>
      </div>
    );
  }
}

SvgGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  chartId: PropTypes.string.isRequired,
  order: PropTypes.arrayOf(String).isRequired,
  legendData: PropTypes.object.isRequired,
};

export default SvgGraph;
