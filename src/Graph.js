import React, { Component, PropTypes } from 'react';
import SvgGraph from './SvgGraph';

class Graph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.data[0].date,
      stopDate: this.props.data[this.props.data.length-1].date
    };

  }

  render() {
    let { data, ...props} = this.props;

    let optionsStartDate = data.filter((e) => e.date < this.state.stopDate)
                               .map( (e) =>
                                     {
                                       const dateUs = e.date.toLocaleDateString('en-US');
                                       return (<option key={`start-${dateUs}`} value={dateUs}>
                                                {dateUs}
                                              </option>);
                                     }
                                   );
    let optionsStopDate = data.filter((e) => e.date > this.state.startDate)
                              .map( (e) =>
                                    {
                                      const dateUs = e.date.toLocaleDateString('en-US');
                                      return (<option key={`stop-${dateUs}`} value={dateUs}>
                                               {dateUs}
                                              </option>);
                                    }
                                  );

    const stopDateChange = (e) => {
      this.setState({ stopDate: new Date(e.target.value) });
    };

    const startDateChange = (e) => {
      this.setState({ startDate: new Date(e.target.value) });
    };

    return (
      <div className="Graph">
        Start date:
        <select value={this.state.startDate.toLocaleDateString('en-US')} onChange={startDateChange}>
          {optionsStartDate}
        </select>
        &nbsp;Stop date:
        <select value={this.state.stopDate.toLocaleDateString('en-US')} onChange={stopDateChange}>
          {optionsStopDate}
        </select>
        <SvgGraph data={data.filter( e => e.date >= this.state.startDate && e.date <= this.state.stopDate)}
                  {...props}
        />
      </div>
    );
  }
}

Graph.defaultProps = {
  chartId: 'chart',
}

Graph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(Object).isRequired,
  order: PropTypes.arrayOf(String).isRequired,
  legendData: PropTypes.object.isRequired,
};

export default Graph;
