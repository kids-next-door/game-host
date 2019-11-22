import React, { Component } from 'react'

export class Tile extends Component {

    styles = ({ color, size }) => ({
        width: size.width,
        height: size.height,
        // backgroundColor: isActive ? '#D7980A' : '#0C6193',
        backgroundColor: color,
        display: 'inline-block',
        boxShadow: '-5px 5px #000',
    })

    getPlayerElements = () => {
        if(this.props.colors === undefined){
            return null
        }
        let output = []
        for(let i = 0; i < this.props.colors.length; i++){
            output.push(<div style={{flex: '1 1 0px', backgroundColor: this.props.colors[i] }}></div>)
        }

        return output
    }

    render() {
        if(this.props.colors && this.props.colors.length > 0){
            return <div className='Tile' style={this.styles({ size: { width: 100, height: 100 }, color: '#0C6193' })} >
                <div className='playersContainer' style={{width: '100%', height: '100%', display: 'flex', flexFlow: 'row wrap', }}>
                    {this.getPlayerElements()}
                </div>
            </div>
        } else {
            return <div className='Tile' style={this.styles({ size: { width: 100, height: 100 }, color: '#0C6193' })} >
                <div></div>
            </div>
        }
    }
}
/*
    if (props.colors.length > 0) {
    return (
      <div style={styles({ size: { width: 100, height: 100 }, color: '#D7980A' })} />
    )
  } else {
    return <div style={styles({ size: { width: 100, height: 100 }, color: '#0C6193' })} />
  }
*/
export default Tile
