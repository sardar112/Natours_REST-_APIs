class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // if u want to get the data using query object(Filtering)
    //   req.query.someproperty
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((field) => delete queryObj[field]);
    //in this we we have to set url manually [lte] or [gt]
    let querStr = JSON.stringify(queryObj);
    querStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr = this.query.find.JSON.parse(queryStr);
    // anotherWay
    // {
    //    req.quer.name,
    //    length:{$lte:number}
    //  }

    return this;
  }

  //Sorting

  sorting() {
    //assending sort=property
    //dessending sort=-property
    if (this.querString.sort) {
      //if sorting on multiple multiple
      const sortBy = this.querString.split(',').join(' ');
      query = this.query.sort(sortBy);
      // this.query= this.query.sort(this.queryString.sort)
    } else {
      // this.query= this.query.sort("property or -property")
      this.query = this.query.sort('name');
    }
    return this;
  }

  limitFields() {
    if (this.querString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // this.query= this.query.select("property ||exclud -prop")
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = tis.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    // if(req.query.page){
    //   const totalData= await Tour.countDocument
    //   if(skip >= totalData) throw new Error('does not exist page')
    // }
    return this;
  }
}

module.exports = APIFeatures;
