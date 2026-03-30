declare namespace Express {
  export interface Request {    
    permission?:Record<string,boolean>,
    permissionMeta?:{sectionName:string,actionName:string },
    user?: {
      id: string;
      email:string;
      phone?:string | null;
    };
    rawBody?:Buffer<ArrayBufferLike>
  }
}
