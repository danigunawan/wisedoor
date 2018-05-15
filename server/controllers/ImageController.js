const fs = require("fs")
const randomHex = require('randomhex');
const Equipment = require('../models/Equipment')
const Face = require('../models/Face')
const FaceBelongEquipment = require('../models/FaceBelongEquipment')
const FaceBelongModel = require('../models/FaceBelongModel')
const request = require('request');
const Model = require('../models/Model')

const uploadBasePath = `${process.cwd()}/facenetTrain/image/raw`
const cutBasePath = `${process.cwd()}/facenetTrain/image/cut`
const modelBasePath = `${process.cwd()}/facenetTrain/models`

module.exports = { 

    async retrieveEquipmentId (req, res, next) {
        req.equipmentId = await Equipment.FindIdByOwnerEmailAndName(req.user, req.body.equipmentName)
        next()
    },

    async retrieveFaceId (req, res, next) {
        if (await Face.IsFaceNameInEquipment(req.body.faceName, req.equipmentId)) {
            req.faceId = await Face.FindFaceIdByFaceNameAndEquipmentId(req.body.faceName, req.equipmentId)
        } else {
            req.faceId = await Face.Add(req.body.faceName, false)
            await FaceBelongEquipment.Add(req.faceId, req.equipmentId)
        }
        next()
    },

    async checkIsUpload(req, res, next) {
        const isUpload = await Face.FindIsUploadByFaceId(req.faceId)
        if (isUpload == true) {
            req.send({ success: true, progress: files.length })
        } 
        else{
            next()
        }
    },

    makeRawDirectIfnotExist (req, res, next) {
        if (!fs.existsSync(uploadBasePath + `/${req.faceId}`)) {
            fs.mkdirSync(uploadBasePath + `/${req.faceId}`)
        }
        next()
    },

    async saveRawImage (req, res, next) {
        req.imageName = (await randomHex(16).substring(2)) + '.png'
        fs.writeFile(`${uploadBasePath}/${req.faceId}/${req.imageName}`, req.body.image, 'base64', err => {
            if (err) res.status(500), send({
                error: 'an error has occured trying to upload image'
            }) 
            else
                next()
        })
    },
    
    alignFace (req, res, next) {
        const formData =
            {
                "uploadBasePath": uploadBasePath,
                "faceId": req.faceId,
                "imageName": req.imageName,
                "cutBasePath": cutBasePath
            }
        request.post({ url: 'http://localhost:3000/align', formData: formData }
            , (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    next()
                }
                else {
                    console.log("error" + error)
                    res.send({ error: "An error occured while uploading image" })
                }
            }
        )
    },

    checkAlignProgressAndResponse (req, res, next) {
        fs.readdir(`${cutBasePath}/${req.faceId}`, async (err, files) => {
            if (files.length >= 25) {
                await Face.setIsUpload(req.faceId, true)
                req.modelId = await Model.Add()
                const faceIdArray = await FaceBelongEquipment.FindFaceIdByEquipmentId(req.equipmentId)
                req.faceIdList = []
                faceIdArray.forEach((element)=>{
                    req.faceIdList.push(element["FaceId"])
                })
                next()
            }
            else
                res.send({ success: true, progress: files.length })
        })
    },

    trainFace (req, res, next) {
        const formData =
            {
                "cutBasePath": cutBasePath,
                "faceIdList": req.faceIdList,
                "outputBasePath": modelBasePath,
                "modelId": req.modelId,
            }
        request.post({ url: 'http://localhost:3000/train', formData: formData }
            , async (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    console.log("train finish")
                }
                else {
                    console.log("error" + error)
                    res.send({ error: "An error occured while training model" })
                }
            }
        )
    }
}