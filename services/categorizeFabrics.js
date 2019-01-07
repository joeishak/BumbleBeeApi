const marl = 'Marl';
const ns1 = 'NS I';
const ns2 = 'NS II';
const ns3 = 'NS III';
const ns5 = 'NS V';
const other = 'Other';

module.exports = categorizeItemFabric = (item) => {
       switch (item.fabric) {
              case 'M I':
                  item.fabric = marl;
                  break;
              case 'M II':
                  item.fabric = marl;
                  break;
              case 'M III':
                  item.fabric = marl;
                  break;
              case 'M IV':
                  item.fabric = marl;
                  break;
              case 'M other':
                  item.fabric = marl;
                  break;
              case 'NS I':
                  item.fabric = ns1;
                  break;
              case 'NS I.b':
                  item.fabric = ns1;
                  break;
              case 'NS I.s':
                  item.fabric = ns1;
                  break;
              case 'NS I.v':
                  item.fabric = ns1;
                  break;
              case 'NS II':
                  item.fabric = ns2;
                  break;
              case 'NS II+':
                  item.fabric = ns2;
                  break;
              case 'NS III':
                  item.fabric = ns3;
                  break;
              case 'NS V':
                  item.fabric = ns5;
                  break;
              default:
                  item.fabric = 'Empty';
                  break;
          }
       return item;
}