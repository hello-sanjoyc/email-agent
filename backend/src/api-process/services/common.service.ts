import db from "../../db";
import { CreateEnquiryInput } from "../controllers/v1/types";

export const generateEnquiry = async (input:CreateEnquiryInput):Promise<boolean> => {
    try{
        await db.enquiry.create({
            data:{
                fullName:input.full_name,
                email:input.email,
                phone:input.phone,
                company:input.company,
                message:input.message
            }
        });
        return true;
    }catch(err){
        throw(err);
    }
}