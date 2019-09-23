import './css/reset.css';
import './less/index.less';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';




var func = str => {
    document.getElementById('app').innerHTML = str;
};
func('es6 箭头函数!');

document.getElementById('postcss').innerHTML = "<h1>postcss</h1>";

async function print() {
    return 'hello world'
}
console.log(print());
console.log('虽然在后面，但是我先执行');

function* gen(){
    yield "hello";
    yield "world";
    return "ends"
}
let g1=gen()
console.log(g1.next()); 

class App extends Component{
	render(){
		return (
			<div>react</div>
		)
	}
}
ReactDOM.render(<App />, document.getElementById('react'));