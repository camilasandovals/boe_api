import PremiumApplication from "../models/premiumApplicationSchema.js";

export async function addPremiumApplication(req, res) {
    try {
      const { email , school, program, firstName, lastName, resume, additionalComments } = req.body;
      const doc = await PremiumApplication.findOne({ email: email.toLowerCase(), program: program, school:school })
      if (doc) {
        res.status(401).send({message: "You already applied to this program"})
        return;
      }
  
      const newApplicant = new PremiumApplication({
        email: email.toLowerCase(),
        school: school,
        program: program,
        firstName: firstName,
        lastName: lastName,
        resume: resume,
        additionalComments: additionalComments,
      });
  
      await newApplicant.save();
      res.status(201).send({message: "You successfully applied to this program!"});

    } catch (error) {
        res.status(500).json({
          error: [error.message],
          message: "An error occurred",
        });
      }
    }
    