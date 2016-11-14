import React, { Component } from 'react';
import { csv } from 'd3-request';

import logo from './logo.svg';
import './App.css';
import Graph from './Graph';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { data: null }
  }

 componentWillMount() {
    const row = (d)=> {
      return {
        all_total:  +d.all_total,
        all_uniques:  +d.all_uniques,
        ips_total:  +d.ips_total,
        ips_uniques:  +d.ips_uniques,
        files_total:  +d.files_total,
        files_uniques:  +d.files_uniques,
        domains_total:  +d.domains_total,
        domains_uniques:  +d.domains_uniques,
        urls_total:   +d.urls_total,
        urls_uniques: +d.urls_uniques,
        date: new Date(d.date)
      }
    }

    csv('/threats.csv', row, (e, d) => {
      if (e) throw e;
      this.setState({ data: d });
    });

  }


  render() {

    const order = [ 'ips', 'files', 'domains', 'urls'];
    const legendData = {
      ips: { color: '#b68e52', desc: 'IPs' },
      files: { color: '#c4aa88', desc: 'Files' },
      urls: { color: '#8399b3', desc: 'URLs' },
      domains: { color: '#697a55', desc: 'Domains' },
    };


    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
         The upper chart shows uniques; the lower chart shows totals.
        </p>
        {
            this.state.data ?
              <Graph width={900} height={400} data={this.state.data} order={order} legendData={legendData} />
            :
              <div>loading data</div>
        }
      </div>
    );
  }
}

export default App;
