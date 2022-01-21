import React from 'react';
import logo from './logo.svg';
import './App.css';

interface Dude {
	person_id : number,
	fname: string,
	lname: string,
	age: number
}
function loadData(): Dude[] {
	return [
		{ fname:"John", lname:"Doe", age:45, person_id:100 }
	];
}

class TableThingy extends React.Component<{},{dudes:Dude[]}> {

	constructor(props:{}) {
		super(props);
		this.state = {
			dudes : loadData()
		};
	}

	newDude(event:object) {
		alert("new dude");
	}

	removeHim(dude:Dude) {
		alert("remove " + dude.person_id);
	}

	render() {
		return (
			<table>
				<thead>
					<tr>
						<th>Favorite number</th>
						<th>First name</th>
						<th>Last name</th>
						<th>Age</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td></td>
						<td><input type="text"/></td>
						<td><input type="text"/></td>
						<td><input type="number"/></td>
						<td><button onClick={this.newDude}>Add</button></td>
					</tr>
					{
						this.state.dudes.map(d =>
							<tr key={d.person_id}>
								<td>{d.person_id}</td>
								<td>{d.fname}</td>
								<td>{d.lname}</td>
								<td>{d.age}</td>
								<td><button onClick={() => this.removeHim(d)}>Delete</button></td>
							</tr>
						)
					}
				</tbody>
			</table>
		);
	}
}

function App() {
  return (
    <div className="App">
      <TableThingy />
    </div>
  );
  /*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
   */
}

export default App;
