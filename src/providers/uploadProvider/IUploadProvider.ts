import IUploadPrividerDto from './IUploadPrividerDto'

export default interface IUploadPrivider{
  upload (data : IUploadPrividerDto) : Promise<string>
  delete (file_name : string) : Promise<boolean>
}
