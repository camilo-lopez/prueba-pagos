
const bcrypt =  require('bcryptjs');
const helpers = {};

helpers.encriptar = async (contrasena) => {
    const salt = await bcrypt.genSalt(0);
    const hash = await bcrypt.hash(contrasena, salt);
    return hash;
};

helpers.comparacontra = async (contrasena, savedPassword) => {
    try {
        console.log(savedPassword)
      return await bcrypt.compare(contrasena, savedPassword)
      
    }catch(e){
        console.log(e)
    }
    
};

module.exports = helpers;