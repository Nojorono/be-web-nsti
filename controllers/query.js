const query = {

    getTestimoni:`select t.*,i.imagePath,i.imageName, i.category from Testimonis t 
    left join Images i on i.id = t.id
    order by t.updatedAt desc
    limit :pageSize offset :pageNum`,

    countCareer:`select COUNT(*) from careers c`,

    mediaDate : `select p.*, i.id_image, i.imagePath, i.imageName, i.category from media p 
    left join Images i on i.id = p.id
    where (cast(p.createdAt as date)) between :fDate and :sDate
    order by p.updatedAt desc
    limit :pageSize offset :pageNum`,
    getProductDetail: `select * from Products p
    left join from Images i on i.id = p.id 
    where p.id = :id`,
    getImageDetail: `select * from Images i  
    where i.id = :id
   `,
   getImageProd : `select i.imagePath, i.category ,p.* from Images i
   left join Products p on p.id = i.id
   where i.id = :id`,

   getProducts : `select p.*  from Products p
   where p.id = :id`,

   getImages : `select i.imageName, i.id_image, i.category from Images i
   where i.id = :id
   order by i.category desc`,

   getImage:`select i.imagePath, i.category  from Images i
   where i.id = :id`,
   getTestimoniDel : `select i.imagePath, i.category ,p.* from Images i
   left join Testimonis p on p.id = i.id
   where i.id = :id`,

   getProdLimit: `select p.* from Products p 
   left join from Images i on i.id = p.id
   limit :limit offset :offset`,

   getProd: `select p.*, i.* from Products p 
   left join Images i on i.id = p.id
   where i.category = '01'
   order by p.createdAt desc
   `,
   getTestimoniDetail:`select i.imagePath ,i.imageName,i.id_image,p.* from Images i
   left join Testimonis p on p.id = i.id
   where i.id = :id`,

   getCountMedia:`select COUNT(*) from media p`,
   getCountMediaDate:`select COUNT(*) from media p 
   where (cast(p.createdAt as date)) between :fDate and :sDate
   order by p.updatedAt desc
   limit :pageSize offset :pageNum`,
   getMedia:`select p.*,  i.id_image, i.imagePath, i.imageName, i.category from media p 
   left join Images i on i.id = p.id
   order by p.updatedAt desc
   limit :pageSize offset :pageNum`,

   getMediaDetail : `select i.imagePath ,i.imageName,i.id_image,p.* from Images i
   left join media p on p.id = i.id
   where i.id = :id`,

   getCareer: `select c.* from careers c
   order by c.updatedAt desc
   limit :pageSize offset :pageNum `,
   getCareerDetail:`select c.* from careers c
   where c.id = :id`,

   ilikeProduct:
   `select p.id ,p.title from Products p 
   where lower(p.title) like :str
   limit :pageSize`,
   ilikeMedia:`select m.id,m.title from media m 
   where lower(m.title) like  :str
   limit :pageSize `
}

module.exports = query
