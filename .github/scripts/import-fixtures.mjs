import {crc32,deflateRawSync} from 'node:zlib';
export function fixtureZip(entries){
 const local=[],central=[];let offset=0;
 for(const entry of entries){const name=Buffer.from(entry.name),data=Buffer.from(entry.data||''),packed=deflateRawSync(data),crc=crc32(data);
  const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(8,8);h.writeUInt32LE(crc,14);h.writeUInt32LE(packed.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(name.length,26);
  const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(0x0314,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(8,10);c.writeUInt32LE(crc,16);c.writeUInt32LE(packed.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(((entry.mode||0x81a4)*65536)>>>0,38);c.writeUInt32LE(offset,42);
  local.push(h,name,packed);central.push(c,name);offset+=h.length+name.length+packed.length;
 }
 const c=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(c.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...local,c,end]);
}
export const sourceSkill='---\nname: legal-draft\ndescription: 法律合同草拟时查模板并校验事实\n---\n# 合同草拟\n先确认当事人和标的，再读取 references/check.md。未知金额待确认。';
export function syntheticBundle(){return fixtureZip([
 {name:'skills/legal/SKILL.md',data:sourceSkill},{name:'skills/legal/references/check.md',data:'核对金额、日期与争议条款。'},
 {name:'skills/legal/scripts/helper.py',data:'raise SystemExit("must not execute on import")'},{name:'skills/LICENSE',data:'Synthetic fixture license; not an upstream license.'},
 {name:'templates/合成合同.txt',data:'合同示例：付款前核实双方授权。履行地点是合成测试市。'},
 {name:'templates/同内容副本.txt',data:'合同示例：付款前核实双方授权。履行地点是合成测试市。'},
 {name:'assets/readme.bin',data:Buffer.from([0,255,1])},
 ]);}
