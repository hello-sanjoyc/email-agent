import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError.utils";
import { changeIsSeenOfActionItem, changeProfileAIResponseTone, changeProfileAIService, createCalendarAccFormEmailAcc, createCalendarAccount, createEmailAccount, deactivateUser, doesAnyEmailAccExist, fetchActionItems, fetchAiResponseToneByID, fetchAiServiceByID, fetchAIServicesDataset, fetchAIToneDataset, fetchEmailAccount, fetchUserData, findActionItemById, generateStats, getAccounts, getCalendarAccounts, getUserProfile, softOrHardDeleteCalendarAccount, softOrHardDeleteEmailAccount, toggleCalendarAccountState, toggleEmailAccountStatus, triggerEmailProcessingManually, updateEmailAccountData, updateEmailAccountPriorityWeight, updateProfileAutomationStatus, updateUser } from "../../services/user.service";
import { ChangeAIResponseToneInput, ChangeAIServiceInput, LinkAccountInput,LinkCalendarAccountInput, ToggleAutomationStatus, UpdateEmailAccountIntput, UpdateEmailAccountsPriorityInput, UpdateProfileInput } from "./types";
import { LinkAccountFactory } from "../../services/link-account/factory";
import { LinkCalendarAccountFactory } from "../../services/link-calendar-account/factory";
import { isEmailUsed } from "../../services/auth.service";

//to get all the email accounts for a logged in user
export const getUserAccounts = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('invalid user',401);
        const accounts = await getAccounts(userId);
        return res.status(200).json({
            error:false,
            message:'accounts fetched',
            data:accounts
        });
    }catch(err){       
        next(err);
    }
}
//to link an email account for a logged in user with different available provider options
export const linkAccount = async (req:Request,res:Response,next:NextFunction)=>{
    try{
       const userId = req.user?.id;
       if(!userId) throw new AppError('invalid user',400);
       //TODO: this next two lines is specifically added for the case when only single email account is allowed for a user
       //should remove it when not necessary in future.
       const isAnyEmailAccPresent = await doesAnyEmailAccExist(userId);
       if(isAnyEmailAccPresent) throw new AppError('Email account already exists for the user',409); 
       const input = req.body as LinkAccountInput;      
       const providerName = input.provider.toLowerCase();
       const provider =  LinkAccountFactory.getProvider(providerName);
       const providerResponse = await provider.link(input);
       const emailAccId = await createEmailAccount(providerResponse,userId);
       await triggerEmailProcessingManually(userId,emailAccId);
       return res.status(200).json({
        error:false,
        message:"Email account created for the user"
       }); 
    }catch(err){
        next(err);
    }
}
//to make an email account active or inactive
export const toggleAccountStatus = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const accountId = req.params.id as string;        
        const updatedAccountStatus = await toggleEmailAccountStatus(accountId);
        const message = updatedAccountStatus?"Email account activated":"Email account deactivated";
        const error = false;
        return res.status(200).json({error,message});   
    }catch(err){
        next(err);
    }
}
//to get all the calendar accounts for the logged in user
export const getUserCalendarAccounts = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('invalid user',401);
        const accounts = await getCalendarAccounts(userId);
        return res.status(200).json({
            error:false,
            message:'accounts fetched',
            data:accounts
        });
    }catch(err){
        //throwing error to the next middleware(global error handling middleware in this case)
        next(err);
    }
}
//to link a calendar account with different provider options and facility to add existing email account as a calendar account
export const linkCalendarAccount = async (req:Request,res:Response,next:NextFunction)=>{
    try{
       const userId = req.user?.id;
       if(!userId) throw new AppError('invalid user',400); 
       const input = req.body as LinkCalendarAccountInput; 
       //if adding an already exising email account as a calendar account
       if(!input.is_new){
            const emailAccountId = input.account_id;
            if(!emailAccountId) throw new AppError('Invalid existing email account',400);
            const existingEmailAccountData = await fetchEmailAccount(emailAccountId);
            await createCalendarAccFormEmailAcc(existingEmailAccountData);
        }else{
            const providerName = input.provider.toLowerCase();
            const provider =  LinkCalendarAccountFactory.getProvider(providerName);
            const providerResponse = await provider.link(input);
            await createCalendarAccount(providerResponse,userId);
        }            
       return res.status(200).json({
        error:false,
        message:"Calendar account created for the user"
       }); 
    }catch(err){
        next(err);
    }
}
//to get the profile details of a logged in user
export const getProfile = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('invalid user',400);
        const profile = await getUserProfile(userId);
        return res.status(200).json({
            error:false,
            message:'profile fetched',
            data:profile
        });
    }catch(err){
        next(err);
    }
}
//to make a calendar account active or inactive
export const toggleCalendarAccountStatus = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const accountId = req.params.id as string;        
        const updatedAccountStatus = await toggleCalendarAccountState(accountId);
        const message = updatedAccountStatus?"Calendar account activated":"Calendar account deactivated";
        const error = false;
        return res.status(200).json({error,message});   
    }catch(err){
        next(err);
    }
}
//get service statistics data for a logged in user
export const getServiceStats = async (req:Request,res:Response,next:NextFunction) => {
    try{        
        const {to,from} = req.query;
        const userId = req.user?.id;
        if(!userId) throw new AppError("invalid user",400);
        //find the dashboard data for this user
        const serviceStats = await generateStats(userId,to as string,from as string);
        return res.status(200).json({
            error:false,
            message:"data fetched",
            data:serviceStats
        });
    }catch(err){
        next(err);
    }
}
//update a user's profile
export const updateProfile = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const input = req.body as UpdateProfileInput;
        const userId = req.user?.id;
        if(!userId) throw new AppError('invalid user',400);
        const userData = await fetchUserData(userId);
        if(userData.email !== input.email){
            const emailIsUsed = await isEmailUsed(input.email);
            if(emailIsUsed) throw new AppError('Email is already in use',409);
        }
        await updateUser(userId,input.name,input.email,input.phone);
        return res.status(200).json({
            error:false,
            message:'User updated'
        });
    }catch(err){
        next(err);
    }
}
//fetch available response tones
export const getAIResponseTones = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('Invalid user',400);     
        const result = await fetchAIToneDataset(userId);
        return res.status(200).json({
            error:false,
            message:'Available AI response tones fetched',
            data:result
        });
    }catch(err){
        next(err);
    }
}
//change AI response tone
export const changeAIResponseTone = async (req:Request,res:Response,next:NextFunction) => {
    try{        
        const input = req.body as ChangeAIResponseToneInput;
        const userId = req.user?.id;
        if(!userId) throw new AppError("Invalid user",400);
        const toneData = await fetchAiResponseToneByID(input.id);        
        const userData = await getUserProfile(userId);
        if(userData.aiResponseTone === toneData.tone) throw new AppError("Response tone already set",409);
        await changeProfileAIResponseTone(userId,toneData.tone);
        return res.status(200).json({
            error:false,
            message:`AI response tone is set to ${toneData.tone}`
        });
    }catch(err){
        next(err);
    }
}
//toggle automation status for a profile
export const toggleAutomationStatus = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError("Invalid user",400);        
        const currentAutomationStatus = await updateProfileAutomationStatus(userId);
        return res.status(200).json({
            error:false,
            message:currentAutomationStatus?"automation activated":"automation deactivated"
        });
    }catch(err){
        next(err);
    }
}
//update email accounts priority for a user
export const updateEmailAccountsPriority = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const input  = req.body as UpdateEmailAccountsPriorityInput;
        const userId = req.user?.id;
        if(!userId) throw new AppError('Invalid user',400);
        //check if priority sum is valid or not
        const totalPriority =input.updates.reduce((counter,each)=>{
            return counter + each.priority
        },0);
        if(totalPriority !== 100) throw new AppError('Invalid Priorities',400);
        await updateEmailAccountPriorityWeight(input.updates,userId);
        return res.status(200).json({
            error:false,
            message:'Priority updated'
        });
    }catch(err){
        next(err);
    }
}
//delete email account(soft or hard based on usage)
export const deleteEmailAccount = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const emailAccId = req.params.id as string;
        const userId = req.user?.id;
        if(!userId) throw new AppError('Invalid user',400);
        if(!emailAccId) throw new AppError('Invalid email account',400);
        const deletionResponse = await softOrHardDeleteEmailAccount(userId,emailAccId);
        if(!deletionResponse) throw new AppError('Error deleting email account',400);
        return res.status(200).json({
            error:false,
            message:"Email account deleted"
        });
    }catch(err){
        next(err);
    }
}
//delete calendar account(soft or hard based on usage)
export const deleteCalendarAccount = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const calendarAccId = req.params.id as string;
        const userId = req.user?.id;
        if(!userId) throw new AppError('Invalid user',400);
        if(!calendarAccId) throw new AppError('Invalid email account',400);
        const deletionResponse = await softOrHardDeleteCalendarAccount(userId,calendarAccId);
        if(!deletionResponse) throw new AppError('Error deleting calendar account',400);
        return res.status(200).json({
            error:false,
            message:"Calendar account deleted"
        });
    }catch(err){
        next(err);
    }
}
//get AI services for a user
export const getAIServices = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('Invalid user',400);     
        const result = await fetchAIServicesDataset(userId);
        return res.status(200).json({
            error:false,
            message:'Available AI services fetched',
            data:result
        });
    }catch(err){
        throw err;
    }
}
//change AI service for a user
export const changeAIService = async (req:Request,res:Response,next:NextFunction) => {
    try{        
        const input = req.body as ChangeAIServiceInput;
        const userId = req.user?.id;
        if(!userId) throw new AppError("Invalid user",400);
        const serviceData = await fetchAiServiceByID(input.id);        
        const userData = await getUserProfile(userId);
        if(userData.aiServiceName === serviceData.name) throw new AppError("AI service already set",409);
        await changeProfileAIService(userId,serviceData.name);
        return res.status(200).json({
            error:false,
            message:`AI response tone is set to ${serviceData.name}`,
            data:null
        });
    }catch(err){
        next(err);
    }
}
//get action items for a certain user
export const getActionItems = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const {to,from,type} = req.query;
        const userId = req.user?.id;
        if(!userId) throw new AppError("Invalid user",400);
        const data = await fetchActionItems(to as string,from as string, type as string,userId);
        return res.status(200).json({
            error:false,
            message:"Action items fetched",
            data
        });
    }catch(err){
        next(err);
    }
}
//toggle is seen of action item
export const toggleIsSeenOfActionItem = async (req:Request, res:Response,next:NextFunction) => {
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError("Invalid user",400);
        const actionItemId = req.params.id as string;
        if(!actionItemId) throw new AppError("Invalid action item",400);
        const actionItemData = await findActionItemById(actionItemId);
        await changeIsSeenOfActionItem(actionItemId,actionItemData.isSeen);
        const newIsSeen = !actionItemData.isSeen;
        return res.status(200).json({
            error:false,
            message:newIsSeen?"Action item seen":"Action item unseen"
        });
    }catch(err){
        next(err);
    }
}
//deactivate user Profile
export const deactivateProfile = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const userId = req.user?.id;
        if(!userId) throw new AppError('Invalid user',400);
        await deactivateUser(userId);
        return res.status(200).json({
            error:false,
            message:"Profile deactivated successfully"
        });
    }catch(err){
        next(err);
    }
}
//update details of email account(currently only done for custom)
export const updateEmailAccount = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const input = req.body as UpdateEmailAccountIntput;
        const userId = req.user?.id;
        const emailAccId = req.params.id as string;
        if(!userId) throw new AppError("Invalid user",400);
        if(!emailAccId) throw new AppError("Invalid email account",400);
        await updateEmailAccountData(userId,emailAccId,input.email,input.password);
        return res.status(200).json({
            error:false,
            message:"Email account updated successfully"
        });
    }catch(err){
        next(err);
    }
}