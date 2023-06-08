import Schools from "../models/schools.js";

// ---------------   Medications
export async function getMedications(req, res) {
    const { email } = req.query;
    
    try {
      const medications = await Medication.find({ email });
      res.status(200).send(medications);
    } catch (error) {
      res.status(500).send("Error retrieving medications");
    }
  }
  export async function getMedInfo(req,res){
    try {
      const docId = { "_id": new ObjectId(req.params.docId)}
      const medication = await Medication.findOne(docId);
      res.send(medication)
    }
    catch (error) {
    res.status(500).send({ message: "An error ocurred"});
    }
  }
  export async function addMedication(req,res){
    
    try {
      const {nameMed, email, dosage, frequency, unit, quantity, notes, medImg, show, endDate, doctor, reactions, takingPerDayOrWeek, totalTaken } = req.body;
      const newMedication = new Medication({nameMed, email, dosage, frequency, unit, quantity, notes, medImg, show, endDate, doctor, reactions, takingPerDayOrWeek, totalTaken });
      await newMedication.save();
      await getMedications(req, res);
    }
    catch (error) {
      res.status(500).json({
        error: [error.message],
        message: "an error",
      });
    }
  }
  export async function deleteMedication(req, res){
    //updating points
    const { email } = req.query;
    try {
      const points = { $inc: { points: 20 } }
      const user = await User.findOneAndUpdate({ email:email }, points, { returnOriginal: false });
      //await User.findOneAndUpdate(user, points, { returnOriginal: false });
      await getUsers(req, res);
    }
    catch {
      res.status(200).send({message: "points added"})
    }
  }
  export async function updateMedication(req, res){
    try {
    const returnOption = { returnNewDocument: true};
      const {variable, value} = req.body
      // console.log(variable, value,req.body)
    //No mostrar el medicamento despues de dar click
    const MedicationDocId = { "_id": new ObjectId(req.params.docId)}
    const medicationUpdate = {[variable]: value}
    await Medication.findOneAndUpdate(MedicationDocId, medicationUpdate, returnOption);
  
  
    //Sumatoria de 20 puntos al usuario
    const { email } = req.query;
    const userEmail = {email:email}
    const points = { $inc: { points: 20 } }
    await User.findOneAndUpdate(userEmail, points, returnOption);
  
    const medications = await Medication.find({ email });
    const thisUser = await User.findOne({email});
  
    const reply = {medications:medications, user:thisUser}
    res.status(200).json(reply)
  
  
    }
    catch {
      res.status(200).send({message: "updated medication"})
    }
  }