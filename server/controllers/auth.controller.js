import { getAdminByEmail } from "../models/admins.model.js";

export async function login(req, res) {
    const email = req.body.email;
    //const password = req.body.password;//
    
    const admin = await getAdminByEmail(email);
    
    if (admin.rowCount === 0){
        return res.status(400).json({message: "invalid email or password"})
    }
    

    res.status(200).json({message: "account existed"})


}