import express from "express";
import expressAsyncHandler from 'express-async-handler';
import Business from '../models/businessmodel.js';
import { isAuth, isAdmin } from "../utils.js";



const businessRouter = express.Router();



businessRouter.get('/', async (req, res) => {
    const business = await Business.find();
    res.send(business);
});
  



businessRouter.post("/addbusiness", isAuth, isAdmin,expressAsyncHandler(async(req,res)=>{
    const business = new Business({
        name: "sample name"+ Date.now(),
        slug: "sample slug" + Date.now(),
        countInstock: 0,
        image: "/images/p4.jpg",
        address: "sample address"+ Date.now(),
        description: "sample description"+ Date.now()

    })
    const businesses = await business.save();
    res.send({ message: 'Business Created', businesses });



}))



businessRouter.delete('/:id',isAuth,isAdmin,expressAsyncHandler(async (req, res) => {
      const business = await Business.findById(req.params.id);
      if (business) {
        await business.remove();
        res.send({ message: 'Business Deleted' });
      } else {
        res.status(404).send({ message: 'Business Not Found' });
      }
    })
);





businessRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const businessid = req.params.id;
    const business = await Business.findById(businessid);
    if (business) {
      business.name = req.body.name;
      business.slug = req.body.slug;
      business.image = req.body.image;
      business.countInstock = req.body.countInstock;
      business.address = req.body.address;
      business.description = req.body.description;
      await business.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

const PAGE_SIZE = 5;

businessRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const businesses = await Business.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countbusinesses = await Business.countDocuments();
    res.send({
      businesses,
      countbusinesses,
      page,
      pages: Math.ceil(countbusinesses / pageSize),
    });
  })
);


businessRouter.get('/slug/:slug', async (req, res) => {
  const business = await Business.findOne({ slug: req.params.slug });
  if (business) {
    res.send(business);
  } else {
    res.status(404).send({ message: 'Business Not Found' });
  }
});




businessRouter.get('/:id', async (req, res) => {
    const business = await Business.findById(req.params.id);
    if (business) {
      res.send(business);
    } else {
      res.status(404).send({ message: 'Business Not Found' });
    }
});








export default businessRouter;