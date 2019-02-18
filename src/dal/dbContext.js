import Models from "dal/sets/models";
import Races from "dal/sets/races";
import Pods from "dal/sets/pods";
import EnvironmentObjects from "dal/sets/environmentObjects";
import Users from "dal/sets/users";

let DBContext = {
	Models : new Models(),
	Races : new Races(),
	Pods : new Pods(),
	EnvironmentObjects : new EnvironmentObjects(),
	Users : new Users()
};

export default DBContext;