

var ResponseManager={

    ServerError:function(req,res,error){
        console.log(error);
        var response={
            Status:1,
            Message:'Internal server error.'
        }

            
        console.error('\n\n');
        console.error('********** Error at ServerError - Start **********');
        console.error('**************************************************');
        console.error(error);
        console.error('**************************************************');
        console.error('********** Error at ServerError - End ************');
        console.error('\n\n');

        res.send(response);
    },
    ValidationError:function(req,res,errors,isInternal){

        if(isInternal){

            var response={
                Status:2,
                Message:errors
            }
        }
        else{
            
            var errorObj=[];

            (errors).forEach(element => {
                errorObj.push({Key:element.context.label,Message:element.message})
            });

            var response={
                Status:2,
                Message:errorObj
            }
            errors=errorObj;
        }

        

        console.error('\n\n');
        console.error('********** Error at Validation - Start **********');
        console.error('*************************************************');
        console.error(errors);
        console.error('*************************************************');
        console.error('********** Error at Validation - End ************');
        console.error('\n\n');

        res.send(response);
    },
    OutputPrepare:function(req,res,next){

        if(req.OutPut.error){
            if(req.OutPut.data.InvalidData)
                ResponseManager.ValidationError(req,res,req.OutPut.data.errors,true);
            else
                ResponseManager.ServerError(req,res,req.OutPut);
        }
        else{
            var response={
                Status:0,
                Message:'',
                Data:req.OutPut.data
            }
    
            res.send(response);

 
            console.error('\n\n');
            console.error('********** Sucess Result - Start **********');
            console.error('**************************************************');
            console.error(response);
            console.error('**************************************************');
            console.error('********** Sucess Result - End ************');
            console.error('\n\n');

        }



    }
};
module.exports=ResponseManager;