import React, { Component } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip , Cell} from 'recharts'
import randomColor from 'randomcolor';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

class BarGraphManipulator extends Component {
constructor(props) {
  super(props);
  this.state ={
    buttonValue: [],
    barValue: [],
    limit : null,
    dropDownValue: 0,
    newBarValue:null,
    changeValue:false,
    openSnackBar:false
  }
}
componentWillMount() {
  fetch(`http://pb-api.herokuapp.com/bars`)
  .then (res => res.json())
  .then (data => this.setState({buttonValue: data.buttons, barValue:data.bars, limit:data.limit}));

}
handleDropDownChange(event, index, value) {
    console.log(event, index, value)
        this.setState({dropDownValue: value })
}

handleRequestClose() {
    this.setState({
        openSnackBar: false,
    });
  };

onClickButtonValue(value, index, initialBarData) {
    //console.log(value,'value',index,'index',initialBarData,'initialBarData')
    
        for (var i in initialBarData) {
            if (initialBarData[i].id === this.state.dropDownValue) {
                initialBarData[i].initialData = initialBarData[i].initialData + value;
                this.setState({initialData:value})
                break; 
            }
        }
        this.setState({newBarValue:initialBarData});

        if (this.state.newBarValue!= null && this.state.limit < this.state.newBarValue[this.state.dropDownValue].initialData) {
            this.setState({openSnackBar: true});
        }
    }
render() {

    const initialBarData = this.state.barValue.map((bar, i) => (
            {   name : `graph ${i}`,
                initialData: bar,
                id: i
            }
    ));


console.log(this.state.newBarValue,'this.state.newBarValue')
    return (
      <div style={{marginTop:'8%',display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
        <div style={{marginRight:50, flexDirection:'column'}}>
        <DropDownMenu value={this.state.dropDownValue} onChange={this.handleDropDownChange.bind(this)}>
          {this.state.barValue.map((dropDownMenu, i) => (
                <MenuItem key={i} value={i} primaryText={`graph ${i}`} />
          ))}
        </DropDownMenu>
        </div>
        <div >
            <Paper>
                <BarChart width={600} height={400} data={this.state.newBarValue? this.state.newBarValue : initialBarData}
                    margin={{top: 40, right: 40, left: 10, bottom: 15}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="initialData">
                { this.state.newBarValue?
                    this.state.newBarValue.map((entry, index) => (
                    <Cell 
                        cursor="pointer"
                        fill={index === this.state.dropDownValue ? this.state.limit < this.state.newBarValue[this.state.dropDownValue].initialData ? 
                            '#FF0000'
                            : randomColor({
                                luminosity: 'light',
                                hue: 'blue',
                                format: 'rgba',
                                alpha: 0.9
                            }) : '#8884d8' }
                        key={`cell-${index}`}/>
                    ))
                    :
                    initialBarData.map((entry, index) => (
                    <Cell 
                        cursor="pointer" 
                        fill={index === this.state.dropDownValue ? 
                            randomColor({
                            luminosity: 'light',
                            hue: 'blue',
                            format: 'rgba',
                            alpha: 0.9
                            }) : '#8884d8' } 
                        key={`cell-${index}`}/>
                    ))
                }
                </Bar>
                </BarChart>
                </Paper>
                {
                    this.state.buttonValue.map((button, i) => (
                        <RaisedButton 
                            key={i} 
                            label={button} 
                            primary={true} 
                            style={{marginRight: 15, marginTop: 30}}
                            onClick={this.onClickButtonValue.bind(this, button , i, this.state.newBarValue? this.state.newBarValue : initialBarData )}
                        />
                    ))
                }
        </div>
        <Snackbar
          open={this.state.openSnackBar}
          message={`Exceeded Limit! Hover the mouse to see the exceeded value`}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </div>
    );
    }
};

export default BarGraphManipulator;
