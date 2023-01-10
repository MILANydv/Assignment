
import chai, { assert, expect, should } from "chai";
import chaiHttp from "chai-http";
import Product from "../routes/productRoutes.js";



chai.use(chaiHttp)


describe('Get all product', () => {

    it('should return Product page',function(done){
        chai.request(Product)
        .get('http://localhost:5000/api/products')
        .end(function(err,res){
          expect(200);
          done();


        
            
        })
      });
    })





    describe('Products added', () => {

        it('Product added', function(done){
            chai.request(Product)
            .post('http://localhost:5000/api/products/')
            .send({

                name : "Test Product",
                slug: "Test Product",
                image: "/image/pd.jpg",
                category: "Sample category",
                brand: "Sample brand",
                countInstock: 1,
                description: "Sample descripition"



            })
            .end(function(err, res){
              expect(200, done());
               
            })
          });
        })

        describe('Products Updated', () => {

            it('Product added', function(done){
                chai.request(Product)
                .put('http://localhost:5000/api/products/')
                .send({
    
                    name : "Test Products",
                    slug: "Test Products",
                    image: "/image/pd.jpg",
                    category: "Sample categorys",
                    brand: "Sample brans",
                    countInstock: 1,
                    description: "Sample descripitions"
    
    
    
                })
                .end(function(err, res){
                  expect(200, done());
                   
                })
              });
            })


    
            describe('Products Deleted', () => {

                it('Product Deleted', function(done){
                    chai.request(Product)
                    .delete('http://localhost:5000/api/products/1')
                    .end(function(err, res){
                      expect(res.status(500));
                      done()
                       
                    })
                  });
                })


            
                describe('Products search', () => {

                    it('Product search', function(done){
                        chai.request(Product)
                        .get('http://localhost:5000/api/products/slug/3')
                        .end(function(err, res){
                          expect(res.status(200));
                          done()
                           
                        })
                      });
                    })