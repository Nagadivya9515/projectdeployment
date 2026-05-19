  
  
const groupByCategory = (products = []) => {
    const map = {};

    products.forEach((p) => {
      if (!map[p.category]) {
        map[p.category] = [];
      }
      map[p.category].push(p);
    });

    return Object.keys(map).map((cat) => ({
      category: cat,
      items: map[cat],
    }));
  };

  export default groupByCategory;