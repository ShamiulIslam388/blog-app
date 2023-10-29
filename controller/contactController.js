const Contact = require("../models/Contact");

//@route    GET api/contacts
//@desc     get all contacts
//@access   private
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    if (contacts.length < 1)
      return res
        .status(404)
        .json({ message: "There are no contacts available" });
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@route    POST api/contacts
//@desc     create a contact
//@access   private
const createContact = async (req, res) => {
  const { name, email, number } = req.body;
  try {
    let contact = await Contact.findOne({ email });
    if (contact)
      return res.status(400).json({ message: "Contact is already exists" });

    contact = await Contact.create({
      user: req.user.id,
      name,
      email,
      number,
    });
    res.status(201).json(contact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@route    GET api/contacts/:id
//@desc     get a contact by its id
//@access   private
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).json({ message: "There is no contact available" });
    res.status(200).json(contact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@route    PUT api/contacts/:id
//@desc     update a contact by its id
//@access   private
const updateContact = async (req, res) => {
  const { name, email, number } = req.body;
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact)
      return res
        .status(404)
        .json({ message: "There is no contact available to update" });
    if (req.user.id !== contact.user.toString())
      return res.status(401).json({ message: "Unauthorized user to update" });
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, number },
      { new: true }
    );
    res.status(200).json(contact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@route    DELETE api/contacts/:id
//@desc     delete a contact by its id
//@access   private
const deleteContact = async (req, res) => {
  const { name, email, number } = req.body;
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact)
      return res
        .status(404)
        .json({ message: "There is no contact available to delete" });
    if (req.user.id !== contact.user.toString())
      return res.status(401).json({ message: "Unauthorized user to update" });
    contact = await Contact.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Contact is successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
