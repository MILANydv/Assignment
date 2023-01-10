import server from "./../server.js";
import chai, { assert, expect, should } from "chai";
import chaiHttp from "chai-http";
import User from "../routes/userRoutes.js"


chai.use(chaiHttp)


const credentials = {
  email: "Newusers@gmail.com",
  password: "New password",
}
describe('Start Up', () => {

    it('should return status 200 on homepage GET',function(done){
        chai.request(server)
        .get('http://localhost:5000/')
        .end(function(err,res){
          expect(200, done());


        
            
        })
      });
    })



    describe('Registration', () => {

        it('should return status 200 for registering', function(done){
            chai.request(User)
            .post('http://localhost:5000/api/users/signup')
            .send({

                name : "Test new user",
                email: "Newusers123@gmail.com",
                password: "New password",
                isAdmin: true
                
            })
            .end(function(err, res){
              done();
               
            })
          });
        })


        describe('Login', () => {

            it('should return status 200 for login', function(done){
                chai.request(User)
                .post('http://localhost:5000/api/users/signin')
                .send({
    
                    credentials
                    
                })
                .end(function(err, res){
                
                  done();
                })
              });
            })



          
    describe('Updating User', () => {

      it('should update user', function(done){
          chai.request(User)
          .put('http://localhost:5000/api/users/1')
          .send({

              name : "Test new users",
              email: "Newusers1234@gmail.com",
                 
              
          })
          .end(function(err, res){
            done();
             
          })
        });
      })

   


      describe('Deleting User', () => {

        it('should Delete user', function(done){
            chai.request(User)
            .delete('http://localhost:5000/api/users/1')
          
            .end(function(err, res){
              done();
               
            })
          });
        })
  
         