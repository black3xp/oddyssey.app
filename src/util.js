import axios from "axios";
import jwt from 'jwt-decode';

axios.defaults.headers.common = {
    Authorization: "Bearer " + localStorage.getItem("token")
};

axios.defaults.baseURL= "http://192.168.1.101:92/api"

export default axios;

export class UserManager {
    constructor(token) {
        let obj = jwt(token);

        this.name = obj.unique_name;
        this.role = [];
        
        if (typeof obj.role == 'string') {
            this.role.push(obj.role)
        } else if (typeof obj.role == 'object') {
            this.role = obj.role
        }
    }

    is(roleName) {
        return this.role.some(x => x == roleName);
    }
    isAny(roles) {
        let result = false;
        for (const i of roles) {
            if (this.is(i)) {
                result = true;
                break;
            }
        }

        return result;
    }
}