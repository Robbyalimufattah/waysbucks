const { tb_order, tb_user, tb_topping, tb_product } = require('../../models')

exports.addOrder = async (req, res) => {
  try {
    const { data } = req.body;

    const product = await tb_product.findOne({
      where: {
        id: req.body.idProduct,
      }
    })

    const topping = await tb_topping.findOne({
      where: {
        id: req.body.idTopping,
      }
    })

    // code here
    let newOrder = await tb_order.create({
      ...data,
      idUser: req.tb_user.id,
      idProduct: req.body.idProduct,
      idTopping: req.body.idTopping,
      qty: req.body.qty,
      price: req.body.qty * (product.price + topping.price)
    })

    // code here
    res.send({
      status: 'Success...',
      newOrder,
      product: product.title,
      topping: topping.title
    })

  } catch (error) {
    res.status(500). send({
      status: 'Failed',
      message: 'Server Error'
    })
  }
}

exports.getOrders = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await tb_order.findAll({
            where: {
                idUser: id
            },
            include: [
              {
                model: tb_product,
                as: "product",
                attributes: {
                  exclude: ["idUser", "createdAt", "updatedAt"],
                },
              },
              {
                model: tb_topping,
                as: "topping",
                attributes: {
                  exclude: ["idUser", "createdAt", "updatedAt"],
                },
              },
            ],
        });
    
        res.send({
            status: "Success on Getting Orders By User ID",
            orders: data
        });
    } catch (error) {
        res.send({
        status: "Failed",
        message: "Server Error",
        });
    }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await tb_order.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete order id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};