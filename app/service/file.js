'use strict';

const Service = require('egg').Service;
const Minio = require('minio');
const minioClient = new Minio.Client({
  endPoint: 'YOUR_ENDPOINT_URL',
  port: 'ENDPOINT_PORT',
  useSSL: true,
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY',
});

class FileService extends Service {
  async upload(key, filename) {
    const p = new Promise((resolve, reject) => {
      minioClient.presignedPutObject('homework', `${key}/${filename}`, 24 * 60 * 60, (err, presignedUrl) => {
        if (err) return reject(err);
        resolve(presignedUrl);
      });
    });
    const res = await p;
    return res;
  }
  async changeName(key, oldName, newName) {
    const p = new Promise((resolve, reject) => {
      const conds = new Minio.CopyConditions();
      minioClient.copyObject('homework', `${key}/${newName}`, `homework/${key}/${oldName}`, conds, (err, data) => {
        if (err) {
          this.ctx.logger.error(err);
          return resolve(err);
        }
        console.log(data);
        return minioClient.removeObject('homework', `${key}/${oldName}`, (err, data) => {
          if (err) {
            this.ctx.logger.error(err);
            return reject(err);
          }
          return resolve(data);
        });
      });
    });
    const res = await p;
    return res;
  }
  async get(key, filename) {
    const p = new Promise((resolve, reject) => {
      minioClient.presignedGetObject('homework', `${key}/${filename}`, 24 * 60 * 60, (err, presignedUrl) => {
        if (err) return reject(err);
        resolve(presignedUrl);
      });
    });
    const res = await p;
    return res;
  }
  async list(key) {
    const p = new Promise((resolve, reject) => {
      const _list = [];
      const stream = minioClient.listObjectsV2('homework', `${key}/`, true, '');
      stream.on('data', obj => { _list.push(obj); });
      stream.on('error', err => { reject(err); });
      stream.on('end', () => { resolve(_list); });
    });
    const res = await p;
    return res;
  }
}

module.exports = FileService;
