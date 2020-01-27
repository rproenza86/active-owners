import React from 'react';
import { Upload, Button, Icon, message, Progress } from 'antd';

import { storage } from '../../firebase';

import './ImageUploads.scss';

enum Status {
    Uploading = 'uploading',
    Done = 'done',
    Error = 'error',
    Removed = 'removed'
}

enum ProgressStatus {
    Active = 'active',
    Exception = 'exception',
    Success = 'success'
}

interface IImageFile {
    uid?: string;
    name?: string;
    status?: Status;
    url?: string;
    thumbUrl?: string;
}

interface IImageUploadsProps extends IImageFile {
    onImageSave: (imageName: string, imageUrl: string) => void;
}

interface IImageUploadsState {
    progress: number;
    progressStatus: ProgressStatus;
    fileList: File[];
    uploading: boolean;
    defaultFileList?: IImageFile[];
}

class ImageUploads extends React.Component<IImageUploadsProps, IImageUploadsState> {
    state = {
        progress: 0,
        progressStatus: ProgressStatus.Active,
        fileList: [],
        uploading: false,
        defaultFileList: undefined
    };

    loadThumbUrl = () => {
        const filePath = 'teams/' + this.props.name;

        // Get the download URL
        storage
            .ref(filePath)
            .getDownloadURL()
            .then(url => {
                const fileListEntry: any = {
                    uid: '-1',
                    name: this.props.name,
                    status: Status.Done,
                    url,
                    thumbUrl: url
                };

                this.setState({
                    fileList: [fileListEntry]
                });
            })
            .catch((error: any) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                const notifyError = (detail: string) =>
                    message.error('Image Preview Load Failed. ' + detail);
                switch (error.code) {
                    case 'storage/object-not-found':
                        notifyError('Image not found.');
                        break;

                    case 'storage/unauthorized':
                        notifyError('Unauthorized request.');
                        break;

                    case 'storage/canceled':
                        notifyError('Canceled.');
                        break;

                    case 'storage/unknown':
                        notifyError('Unknown error.');
                        break;
                }
            });
    };

    saveImage = (file: any) => {
        const filePath = 'teams/' + file.name;
        this.setState({
            progress: 1
        });

        const errorHandler = (error: any) => {
            // Handle unsuccessful uploads
            console.error(error);

            this.setState({
                uploading: false,
                progressStatus: ProgressStatus.Exception
            });

            message.error('Image Upload Failed.');
        };

        try {
            const uploadTask = storage.ref(filePath).put(file);

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on(
                'state_changed',
                snapshot => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    this.setState({
                        progress
                    });
                },
                errorHandler,
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        console.log('File available at', downloadURL);
                        const addedFile: any = {
                            uid: file.uid,
                            name: file.name,
                            url: downloadURL,
                            thumbUrl: downloadURL,
                            progress: 0
                        };

                        this.setState({
                            uploading: false,
                            fileList: [addedFile],
                            progressStatus: ProgressStatus.Success
                        });

                        this.props.onImageSave(file.name, downloadURL);

                        message.success('Image Uploaded Successfully.');
                    });
                }
            );
        } catch (error) {
            errorHandler(error);
        }
    };

    deleteImage = (file: any) => {
        const filePath = 'teams/' + file.name;
        // Create a reference to the file to delete
        var imageRef = storage.ref(filePath);

        // Delete the file
        imageRef
            .delete()
            .then(() => {
                this.setState({
                    uploading: false,
                    fileList: [],
                    progress: 0,
                    progressStatus: ProgressStatus.Active
                });
                message.success('Image Deleted Successfully.');
                this.props.onImageSave('', '');
            })
            .catch(error => {
                console.error(error);

                this.setState({
                    uploading: false
                });

                message.error('Image Upload Failed.');
            });
    };

    onChange = (info: any) => {
        this.setState({
            uploading: true
        });

        if (info.file.status === Status.Removed) {
            this.deleteImage(info.file);
        } else {
            this.saveImage(info.file);
        }

        const file = { ...info.file, progress: this.state.progress };

        return {
            file,
            fileList: [file],
            event: {
                percent: this.state.progress
            }
        };
    };

    componentDidMount() {
        this.props.name && this.loadThumbUrl();
    }

    componentWillUnmount() {
        this.setState({
            fileList: []
        });
    }

    componentDidUpdate(prevProps: IImageUploadsProps) {
        if (this.props.name && this.props.name !== prevProps.name) {
            this.loadThumbUrl();
        }
    }

    render() {
        const { uploading, fileList, progress, progressStatus } = this.state;
        const props = {
            beforeUpload: (file: any) => {
                this.setState((state: any) => ({
                    fileList: [...state.fileList, file]
                }));
                return false;
            }
        };
        return (
            <div className="aw-image-loader">
                <Upload
                    {...props}
                    listType="picture"
                    multiple={false}
                    onChange={this.onChange}
                    fileList={fileList}
                >
                    <Button disabled={fileList.length === 1} loading={uploading}>
                        <Icon type="upload" /> Select Team Image
                    </Button>
                    {!!progress && <Progress percent={progress} status={progressStatus} />}
                </Upload>
            </div>
        );
    }
}

export default ImageUploads;
