interface ISalesPeople {
  id: string;
  full_name: string;
  phone_number: string;
  address: string;
  ktp: string;
  ktp_photo: string;
  profile_photo: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
