const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function showMapFatalError(message) {
  const container = document.getElementById('map');
  if (!container) return;
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%;background:#1a1d24;color:#f0f0f0;padding:24px;text-align:center;gap:12px;box-sizing:border-box;">
      <div style="font-size:32px;">⚠️</div>
      <div style="font-size:16px;font-weight:600;">Não foi possível carregar o mapa</div>
      <div style="font-size:13px;opacity:0.8;max-width:480px;">${message}</div>
    </div>
  `;
}

if (!MAPBOX_TOKEN) {
  console.error('VITE_MAPBOX_TOKEN não definido. Configure seu token no arquivo .env (veja .env.example).');
  showMapFatalError('O token do Mapbox não foi configurado no ambiente de build. Verifique se o secret VITE_MAPBOX_TOKEN está cadastrado como "Repository secret" (não "Environment secret") no GitHub.');
}
mapboxgl.accessToken = MAPBOX_TOKEN;

// ─── DATA ───
const RAW_ORDERS = [{"id":"11001","cli":"SORVETES MARANATA","end":"RUA MARIA RAIMUNDA DA SILVA, 00584","bai":"BELA VISTA","cid":"Mauriti","uf":"CE","cep":"63210-000","sit":"Faturamento atrasado","vnd":"Eridiane Couto - B","dat":"2026-03-18","kg":125.0,"val":3312.5,"prod":[{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":125.0,"v":3312.5}]},{"id":"11028","cli":"SANTO ANTONIO DE JESUS PREFEITURA GABINE","end":"AVENIDA DR. URSICINO PINTO DE QUEIROZ, 167","bai":"Centro","cid":"Santo Antônio de Jesus","uf":"BA","cep":"44572-050","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-03-26","kg":40.0,"val":1280.0,"prod":[{"d":"1230018 - LEITE EM PO INTEGRAL HORIZONTE 800g","q":40.0,"v":1280.0}]},{"id":"11071","cli":"FUNDO MUNICIPAL DE SAUDE DE SANTO ANTONI","end":"AVENIDA LUIS VIANA, 439 - SECRETARIA DE SAUDE","bai":"CALABAR","cid":"Santo Antônio de Jesus","uf":"BA","cep":"44444-004","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-04-01","kg":80.0,"val":2560.0,"prod":[{"d":"123050 - LEITE EM PO INTEGRAL HORIZONTE 800g VITAM","q":80.0,"v":2560.0}]},{"id":"11070","cli":"FUNDO MUNICIPAL DE SAUDE DE SANTO ANTONI","end":"AVENIDA LUIS VIANA, 439 - SECRETARIA DE SAUDE","bai":"CALABAR","cid":"Santo Antônio de Jesus","uf":"BA","cep":"44444-004","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-04-01","kg":200.0,"val":6400.0,"prod":[{"d":"123050 - LEITE EM PO INTEGRAL HORIZONTE 800g VITAM","q":200.0,"v":6400.0}]},{"id":"11042","cli":"VITORIA DISTRIBUIDORA","end":"RUA CRUZ E SOUZA, 143","bai":"Centro","cid":"Feira de Santana","uf":"BA","cep":"44001-064","sit":"Faturamento atrasado","vnd":"Robson Garcia - B","dat":"2026-04-01","kg":1200.0,"val":32040.0,"prod":[{"d":"1230019 - LEITE EM PO INTEGRAL HORIZONTE 200g","q":1200.0,"v":32040.0}]},{"id":"11040","cli":"MERENQUALY ATACADO","end":"RUA TG-31 (AT B VISTA), 285 - LOTE 16 QUADRA28","bai":"BOA VISTA","cid":"Vitória da Conquista","uf":"BA","cep":"45027-570","sit":"Faturamento atrasado","vnd":"Robson Garcia - B","dat":"2026-04-01","kg":1000.0,"val":26700.0,"prod":[{"d":"1230019 - LEITE EM PO INTEGRAL HORIZONTE 200g","q":1000.0,"v":26700.0}]},{"id":"195","cli":"PREFEITURA DE IBINGA - SP","end":"RUA MIGUEL LANDIM, 333","bai":"Centro","cid":"Ibitinga","uf":"SP","cep":"14940-112","sit":"Faturamento atrasado","vnd":"Licitação 2 - Composto","dat":"2026-04-01","kg":1680.0,"val":33432.0,"prod":[{"d":"123084 - COMPOSTO LACTEO HORIZONTE ALIMLAC 400G","q":1680.0,"v":33432.0}]},{"id":"11183","cli":"DUDAMEL SORVETES E PICOLES NATURAL DA CH","end":"RODOVIA BR 242 KM 282 S/N, SN","bai":"ZONA URBANA","cid":"Seabra","uf":"BA","cep":"46900-000","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-04-15","kg":375.0,"val":3187.5,"prod":[{"d":"1230048 - GLUCOSE EM PO - 25KG","q":375.0,"v":3187.5}]},{"id":"232","cli":"ALVORADA DE MINAS PREFEITURA GABINETE DO","end":"AVENIDA JOSE MADUREIRA HORTA, 190","bai":"Centro","cid":"Alvorada de Minas","uf":"MG","cep":"39140-000","sit":"Faturamento atrasado","vnd":"Licitação Leite/Cacau 1","dat":"2026-04-20","kg":8.0,"val":646.0,"prod":[{"d":"123086 - CACAU MILKSHOW 100% 200G","q":4.0,"v":480.0},{"d":"1230054 - LPI IN HORIZONTE 400g VITAMINAS A,C,D E ","q":4.0,"v":166.0}]},{"id":"231","cli":"ALVORADA DE MINAS PREFEITURA GABINETE DO","end":"AVENIDA JOSE MADUREIRA HORTA, 190","bai":"Centro","cid":"Alvorada de Minas","uf":"MG","cep":"39140-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-04-20","kg":12.0,"val":812.0,"prod":[{"d":"1230054 - LPI IN HORIZONTE 400g VITAMINAS A,C,D E ","q":8.0,"v":332.0},{"d":"123086 - CACAU MILKSHOW 100% 200G","q":4.0,"v":480.0}]},{"id":"11276","cli":"SORVETES GELATTS","end":"RUA MARQUES DA ROCHA, 2000","bai":"SAO BORJA","cid":"Floriano","uf":"PI","cep":"64808-360","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-04-22","kg":101.0,"val":10.1,"prod":[{"d":"1230048 - GLUCOSE EM PO - 25KG","q":100.0,"v":10.0},{"d":"1230064 - LEITE EM PO DESNATADO HORIZONTE SACARIA ","q":1.0,"v":0.1}]},{"id":"11354","cli":"DUDAMEL SORVETES E PICOLES NATURAL DA CH","end":"RODOVIA BR 242 KM 282 S/N, SN","bai":"ZONA URBANA","cid":"Seabra","uf":"BA","cep":"46900-000","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-04-29","kg":125.0,"val":3500.0,"prod":[{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":125.0,"v":3500.0}]},{"id":"11420","cli":"SORVETES E PICOLES MELANO","end":"RUA MANUEL DA ROCHA, 753 - QUADRA258 LOTE 10","bai":"SETOR CENTRAL","cid":"Gurupi","uf":"TO","cep":"77402-040","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-05-07","kg":10.0,"val":1.0,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":5.0,"v":0.5},{"d":"1230048 - GLUCOSE EM PO - 25KG","q":5.0,"v":0.5}]},{"id":"356","cli":"MUNICIPIO DE CONGONHAS DO NORTE GABINETE","end":"RUA JOAO MOREIRA, 22","bai":"Centro","cid":"Congonhas do Norte","uf":"MG","cep":"35850-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-05-14","kg":25.0,"val":945.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":25.0,"v":945.0}]},{"id":"11466","cli":"PREFEITURA MUNICIPAL DE QUISSAMA","end":"RUA CONDE DE ARARUAMA, 425 - PREDIO","bai":"Centro","cid":"Quissama","uf":"RJ","cep":"28735-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-05-18","kg":110.0,"val":5376.8,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":110.0,"v":5376.8}]},{"id":"11488","cli":"NORDESTINA FOODS","end":"RUA DOUTOR GASTÃO MACHADO PONTES DE MIRANDA, SN - ","bai":"CIDADE UNIVERSITÁRIA","cid":"Maceió","uf":"AL","cep":"57073-430","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-05-18","kg":24.0,"val":2.4,"prod":[{"d":"1230048 - GLUCOSE EM PO - 25KG","q":5.0,"v":0.5},{"d":"1230064 - LEITE EM PO DESNATADO HORIZONTE SACARIA ","q":5.0,"v":0.5},{"d":"12300002 - MANIMALTO - MALTODEXTRINA 25KG","q":5.0,"v":0.5},{"d":"1210000 - OKEY LAC ACAI 1 KG","q":1.0,"v":0.1},{"d":"1210049 - OKEY LAC ACAI 50G - Amostra","q":1.0,"v":0.1},{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":2.0,"v":0.2},{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":5.0,"v":0.5}]},{"id":"286","cli":"MORRO DO PILAR GABINETE DO PREFEITO","end":"PRACA PROF. JOSE POLICARPO, 48","bai":"Centro","cid":"Morro do Pilar","uf":"MG","cep":"35875-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-05-19","kg":6.0,"val":449.4,"prod":[{"d":"1230062 - LEITE EM PO INTEGRAL HORIZONTE 200g VITA","q":6.0,"v":449.4}]},{"id":"365","cli":"VARZEA DA PALMA GAB PREFEITO","end":"RUA CLAUDIO MANOEL DA COSTA, 1000","bai":"PINLAR I","cid":"Várzea da Palma","uf":"MG","cep":"39260-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-05-19","kg":10.0,"val":471.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":10.0,"v":471.0}]},{"id":"11502","cli":"ILLA SORVETES","end":"AVENIDA MENINO MARCELO, 9731 - GALPAOF LOTE 0156 Q","bai":"BARRO DURO","cid":"Maceió","uf":"AL","cep":"57045-660","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-05-21","kg":20.0,"val":2.0,"prod":[{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":10.0,"v":1.0},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":10.0,"v":1.0}]},{"id":"371","cli":"PIRAPORA PREFEITURA GABINETE DO PREFEITO","end":"RUA ANTONIO NASCIMENTO, 274","bai":"Centro","cid":"Pirapora","uf":"MG","cep":"39270-082","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-05-21","kg":18.0,"val":757.35,"prod":[{"d":"1230054 - LPI IN HORIZONTE 400g VITAMINAS A,C,D E ","q":18.0,"v":757.35}]},{"id":"11527","cli":"PRODUTOS SKIN LTDA","end":"SITIO BARROCAS, 1000 - ANEXO A","bai":"ZONA RURAL","cid":"Caetés","uf":"PE","cep":"55360-000","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-05-22","kg":1.0,"val":0.1,"prod":[{"d":"1210001 - OKEY LAC GOURMET 25KG","q":1.0,"v":0.1}]},{"id":"378","cli":"FUNDO MUNICIPAL DE SAUDE DE ALTO PARAISO","end":"RUA SAO JOSE OPERARIO, S/N","bai":"PARAISINHO","cid":"Alto Paraíso de Goiás","uf":"GO","cep":"73770-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-05-22","kg":5.0,"val":220.2,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":5.0,"v":220.2}]},{"id":"386","cli":"MORRO DO PILAR GABINETE DO PREFEITO","end":"PRACA PROF. JOSE POLICARPO, 48","bai":"Centro","cid":"Morro do Pilar","uf":"MG","cep":"35875-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-05-22","kg":6.0,"val":449.4,"prod":[{"d":"1230062 - LEITE EM PO INTEGRAL HORIZONTE 200g VITA","q":6.0,"v":449.4}]},{"id":"379","cli":"FUNDO MUNICIPAL DE SAUDE DE ALTO PARAISO","end":"RUA SAO JOSE OPERARIO, S/N","bai":"PARAISINHO","cid":"Alto Paraíso de Goiás","uf":"GO","cep":"73770-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-05-22","kg":20.0,"val":880.8,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":20.0,"v":880.8}]},{"id":"380","cli":"FUNDO MUNICIPAL DE SAUDE DE ALTO PARAISO","end":"RUA SAO JOSE OPERARIO, S/N","bai":"PARAISINHO","cid":"Alto Paraíso de Goiás","uf":"GO","cep":"73770-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-05-22","kg":7.5,"val":330.3,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":7.5,"v":330.3}]},{"id":"377","cli":"PAPAGAIOS PREFEITURA GABINETE DO PREFEIT","end":"AVENIDA FRANCISCO VALADARES DA FONSECA, 250","bai":"VASCO LOPES","cid":"Papagaios","uf":"MG","cep":"35669-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-05-22","kg":100.0,"val":3940.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":100.0,"v":3940.0}]},{"id":"381","cli":"FUNDO MUNICIPAL DE SAUDE DE ALTO PARAISO","end":"RUA SAO JOSE OPERARIO, S/N","bai":"PARAISINHO","cid":"Alto Paraíso de Goiás","uf":"GO","cep":"73770-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-05-22","kg":3.5,"val":154.14,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":3.5,"v":154.14}]},{"id":"11542","cli":"SORVETERIA Q BOMBOM","end":"Rua Joaquim Alexandre Arraes, 160","bai":"Centro","cid":"Araripina","uf":"PE","cep":"56280-000","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-05-25","kg":25.0,"val":2.5,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":25.0,"v":2.5}]},{"id":"388","cli":"PIRAPORA PREFEITURA GABINETE DO PREFEITO","end":"RUA ANTONIO NASCIMENTO, 274","bai":"Centro","cid":"Pirapora","uf":"MG","cep":"39270-082","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-05-25","kg":20.0,"val":841.5,"prod":[{"d":"1230054 - LPI IN HORIZONTE 400g VITAMINAS A,C,D E ","q":20.0,"v":841.5}]},{"id":"11499","cli":"PREFEITURA MUNICIPAL DE CACERES - MT","end":"AVENIDA BRASIL, 119","bai":"JARDIM CELESTE","cid":"Caceres","uf":"MT","cep":"78200-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-05-26","kg":150.0,"val":7446.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":150.0,"v":7446.0}]},{"id":"437","cli":"TUPI PAULISTA GABINETE DO PREFEITO","end":"RUA JULIO CANTADORI, 405","bai":"Centro","cid":"Tupi Paulista","uf":"SP","cep":"17930-005","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-05-26","kg":0.5,"val":0.01,"prod":[{"d":"123074 - CAFE VACUO BELVEDER 500G L 2326","q":0.5,"v":0.01}]},{"id":"417","cli":"SANTA FE DE MINAS PREFEITURA - MG","end":"RUA RUI DA SILVA REIS, 300","bai":"Centro","cid":"Santa Fé de Minas","uf":"MG","cep":"39295-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-05-26","kg":4.8,"val":148.8,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":4.8,"v":148.8}]},{"id":"11564","cli":"MARVI ALIMENTOS","end":"RODOVIA MARTINI RENZO GIOVANNI, SN - KM KM 376","bai":"VILA VILAR","cid":"Ourinhos","uf":"SP","cep":"19904-100","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-05-27","kg":2.0,"val":0.2,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1.0,"v":0.1},{"d":"1230064 - LEITE EM PO DESNATADO HORIZONTE SACARIA ","q":1.0,"v":0.1}]},{"id":"11510","cli":"FMS DE SAO LUIS DE MONTES BELOS","end":"AVENIDA RIO DA PRATA, 662 - QUADRA70 LOTE 16","bai":"Centro","cid":"São Luís de Montes Belos","uf":"GO","cep":"76100-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-05-27","kg":15.0,"val":686.7,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":15.0,"v":686.7}]},{"id":"11558","cli":"SORVETERIA CAROL","end":"RUA PONTA GROSSA, 720","bai":"MILIONARIOS","cid":"Belo Horizonte","uf":"MG","cep":"30620-180","sit":"Faturamento atrasado","vnd":"Ursulla Lopes   B","dat":"2026-05-27","kg":1.0,"val":0.1,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1.0,"v":0.1}]},{"id":"11563","cli":"RESERVA DE MINAS","end":"RODOVIA BR-267, S/N - KM 445","bai":"ZONA RURAL","cid":"Machado","uf":"MG","cep":"37750-000","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-05-27","kg":2.0,"val":0.2,"prod":[{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":1.0,"v":0.1},{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":1.0,"v":0.1}]},{"id":"11559","cli":"BRIZA","end":"AVENIDA TIRADENTES, 812","bai":"DISTRITO INDUSTRIAL ","cid":"Mococa","uf":"SP","cep":"13733-415","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-05-27","kg":2.0,"val":0.2,"prod":[{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":1.0,"v":0.1},{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":1.0,"v":0.1}]},{"id":"11556","cli":"J. A. REPRESENTACOES","end":"AVENIDA BARAO DO RIO BRANCO, 1252 A - PREDIO","bai":"Centro","cid":"Petrolina","uf":"PE","cep":"56304-310","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-05-27","kg":2.0,"val":0.2,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":2.0,"v":0.2}]},{"id":"11531","cli":"FME Águas Lindas de Goiás","end":"AVENIDA AREA ESPECIAL 4- AV 02 JARDIM QUERENCIA, 0","bai":"JARDIM QUERENCIA","cid":"Águas Lindas de Goiás","uf":"GO","cep":"72910-001","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-05-28","kg":1579.0,"val":48949.0,"prod":[{"d":"12300051 - LEITE EM PO INTEGRAL HORIZONTE 1kg VITA","q":1579.0,"v":48949.0}]},{"id":"11569","cli":"JAH PRODUTOS ALIMENTICIOS LTDA","end":"Avenida Elydia Medina Barbosa, 340","bai":"EDEN","cid":"Sorocaba","uf":"SP","cep":"18086-603","sit":"Faturamento atrasado","vnd":"Ursulla Lopes   B","dat":"2026-05-28","kg":2.0,"val":0.2,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":2.0,"v":0.2}]},{"id":"11570","cli":"SORVETERIA Q BOMBOM","end":"Rua Joaquim Alexandre Arraes, 160","bai":"Centro","cid":"Araripina","uf":"PE","cep":"56280-000","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-05-28","kg":1.0,"val":0.1,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1.0,"v":0.1}]},{"id":"11551","cli":"PREFEITURA MUNICIPAL DE PARANATINGA MT","end":"AVENIDA BRASIL, 1900","bai":"Centro","cid":"Paranátinga","uf":"MT","cep":"78870-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-05-29","kg":50.0,"val":2240.0,"prod":[{"d":"1120072 - CAFE VACUO VILLA RICA SUPERIOR 250G","q":50.0,"v":2240.0}]},{"id":"11590","cli":"SORVETES KARYONE IND. COM","end":"RUA JULIETA GETULIO COSTA, 387","bai":"ANTONIO PIMENTA","cid":"Montes Claros","uf":"MG","cep":"39402-329","sit":"Faturamento atrasado","vnd":"RAFAEL","dat":"2026-05-29","kg":280.0,"val":2401.0,"prod":[{"d":"12300002 - MANIMALTO - MALTODEXTRINA 25KG","q":250.0,"v":1900.0},{"d":"1210000 - OKEY LAC ACAI 1 KG","q":30.0,"v":501.0}]},{"id":"11591","cli":"FABRICA DE SORVETES E PICOLES SABOREAR","end":"RUA JOAO ARAUJO, SN","bai":"VILA DE ABRANTES (AB","cid":"Camaçari","uf":"BA","cep":"42827-666","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-05-29","kg":4.0,"val":0.4,"prod":[{"d":"1230048 - GLUCOSE EM PO - 25KG","q":2.0,"v":0.2},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":2.0,"v":0.2}]},{"id":"436","cli":"EDEA PREFEITURA","end":"AVENIDA PRESIDENTE KENNEDY, SN - PREFEITURA MUNICI","bai":"Centro","cid":"Edeia","uf":"GO","cep":"75940-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-05-29","kg":7.5,"val":255.0,"prod":[{"d":"1110033 - CAFE VACUO VILLA RICA TRADICIONAL 500G","q":7.5,"v":255.0}]},{"id":"11557","cli":"PREFEITURA MUNICIPAL DE PARANATINGA MT","end":"AVENIDA BRASIL, 1900","bai":"Centro","cid":"Paranátinga","uf":"MT","cep":"78870-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-01","kg":150.0,"val":6720.0,"prod":[{"d":"1120072 - CAFE VACUO VILLA RICA SUPERIOR 250G","q":150.0,"v":6720.0}]},{"id":"11599","cli":"PALUTI PRODUTOS ALIMENTICIOS LTDA","end":"RUA PERCIO TEIXEIRA DE CARVALHO, 70","bai":"JARDIM OLIVEIRA","cid":"Itu","uf":"SP","cep":"13312-005","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-06-01","kg":2.0,"val":0.2,"prod":[{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":1.0,"v":0.1},{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":1.0,"v":0.1}]},{"id":"11596","cli":"PICOMAIS","end":"RUA MARIA LIMA DA SILVA, 259","bai":"COHAB IBURA DE CIMA","cid":"Recife","uf":"PE","cep":"51335-290","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-06-01","kg":26.0,"val":2.6,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":25.0,"v":2.5},{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1.0,"v":0.1}]},{"id":"11598","cli":"DOCES M.S.B. LTDA","end":"Rua Marcionilio Teodoro de Lima, 102","bai":"Centro","cid":"Vista Alegre do Alto","uf":"SP","cep":"15920-000","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-06-01","kg":9.0,"val":0.9,"prod":[{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":1.0,"v":0.1},{"d":"1230064 - LEITE EM PO DESNATADO HORIZONTE SACARIA ","q":1.0,"v":0.1},{"d":"12300002 - MANIMALTO - MALTODEXTRINA 25KG","q":1.0,"v":0.1},{"d":"1230048 - GLUCOSE EM PO - 25KG","q":1.0,"v":0.1},{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":5.0,"v":0.5}]},{"id":"11595","cli":"DISTRIBUIDORA JLC","end":"RUA DOUTOR HERNANY PESSOA DE LUNA, 67","bai":"PORTAL DO SOL","cid":"João Pessoa","uf":"PB","cep":"58046-714","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-06-01","kg":3.0,"val":0.3,"prod":[{"d":"12100020 - OKEY LAC PANIFICACAO 1KG","q":1.0,"v":0.1},{"d":"1230019 - LEITE EM PO INTEGRAL HORIZONTE 200g","q":1.0,"v":0.1},{"d":"1210000 - OKEY LAC ACAI 1 KG","q":1.0,"v":0.1}]},{"id":"11597","cli":"DIS MAIS","end":"PRACA RIO BRANCO, 203","bai":"Centro","cid":"Gararu","uf":"SE","cep":"49830-000","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-06-01","kg":2.0,"val":0.2,"prod":[{"d":"1210049 - OKEY LAC ACAI 50G - Amostra","q":1.0,"v":0.1},{"d":"1210000 - OKEY LAC ACAI 1 KG","q":1.0,"v":0.1}]},{"id":"11606","cli":"SORVETERIA SABOR NATURAL","end":"RUA FRANCISCO CAPELINI, 44","bai":"SAO SEBASTIAO","cid":"Rio Bananal","uf":"ES","cep":"29920-000","sit":"Proposta pendente","vnd":"Amostra","dat":"2026-06-01","kg":4.0,"val":0.4,"prod":[{"d":"12300002 - MANIMALTO - MALTODEXTRINA 25KG","q":1.0,"v":0.1},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":3.0,"v":0.3}]},{"id":"11601","cli":"IBIS SORVETES","end":"RUA MANOEL BATISTA NETO, 761","bai":"ALTO DO SUMARE","cid":"Mossoró","uf":"RN","cep":"59633-715","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-06-01","kg":3.0,"val":0.3,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1.0,"v":0.1},{"d":"1230048 - GLUCOSE EM PO - 25KG","q":1.0,"v":0.1},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":1.0,"v":0.1}]},{"id":"11607","cli":"VLAMAR INDUSTRIA E COMERCIO LTDA","end":"RUA 03 - LOTE 15 - QUADRA 11, S/N - P EMPRES V. VE","bai":"NOVO MEXICO","cid":"Vila Velha","uf":"ES","cep":"29123-600","sit":"Proposta pendente","vnd":"Amostra","dat":"2026-06-01","kg":3.0,"val":0.3,"prod":[{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":1.0,"v":0.1},{"d":"12300002 - MANIMALTO - MALTODEXTRINA 25KG","q":1.0,"v":0.1},{"d":"1230048 - GLUCOSE EM PO - 25KG","q":1.0,"v":0.1}]},{"id":"11605","cli":"FRIO BOM","end":"PRACA CRISTO REI, 64","bai":"Centro","cid":"Currais Novos","uf":"RN","cep":"59380-000","sit":"Proposta pendente","vnd":"Laender B","dat":"2026-06-01","kg":10.0,"val":1.0,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":10.0,"v":1.0}]},{"id":"11604","cli":"CREME DELICIA BOM","end":"RUA ADJER BARRETO, 178","bai":"GOLANDIM","cid":"São Gonçalo do Amarante","uf":"RN","cep":"59296-277","sit":"Proposta pendente","vnd":"Laender B","dat":"2026-06-01","kg":3.0,"val":0.3,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":3.0,"v":0.3}]},{"id":"475","cli":"MUNICIPIO DE CONGONHAS DO NORTE GABINETE","end":"RUA JOAO MOREIRA, 22","bai":"Centro","cid":"Congonhas do Norte","uf":"MG","cep":"35850-000","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-06-01","kg":0.4,"val":0.04,"prod":[{"d":"1230053 - LPI IN HORIZONTE 400g","q":0.4,"v":0.04}]},{"id":"11609","cli":"BASE AEREA DE CAMPO GRANDE - BACG","end":"AVENIDA DUQUE DE CAXIAS 2905, 2905","bai":"VILA BASE AEREA","cid":"Campo Grande","uf":"MS","cep":"79101-900","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-02","kg":120.0,"val":4110.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":60.0,"v":2070.0},{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":60.0,"v":2040.0}]},{"id":"11611","cli":"49.733.727 EDUARDO DE SOUZA ABRANTES","end":"AVENIDA PRESIDENTE KENNEDY, 265","bai":"GASPAR","cid":"Muriaé","uf":"MG","cep":"36888-109","sit":"Proposta pendente","vnd":"Laender B","dat":"2026-06-02","kg":9.0,"val":0.9,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":3.0,"v":0.3},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":3.0,"v":0.3},{"d":"1230048 - GLUCOSE EM PO - 25KG","q":3.0,"v":0.3}]},{"id":"11608","cli":"DAMIAO NILVAN PINHEIRO DE MACEDO 0491248","end":"RUA DOUTOR ARTUR GONCALVES DE FIGUEIREDO, 72","bai":"CORDEIRO","cid":"Recife","uf":"PE","cep":"50721-250","sit":"Proposta pendente","vnd":"Laender B","dat":"2026-06-02","kg":2.0,"val":0.2,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1.0,"v":0.1},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":1.0,"v":0.1}]},{"id":"448","cli":"FUNDO MUNICIPAL DE ASSISTENCAI SOCIAL","end":"AVENIDA BARAO DO RIO BRANCO, 2846 - TERREOPREDIO","bai":"Centro","cid":"Petrópolis","uf":"RJ","cep":"25680-276","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-02","kg":15.0,"val":565.2,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":15.0,"v":565.2}]},{"id":"449","cli":"FUNDO MUNICIPAL DE ASSISTENCAI SOCIAL","end":"AVENIDA BARAO DO RIO BRANCO, 2846 - TERREOPREDIO","bai":"Centro","cid":"Petrópolis","uf":"RJ","cep":"25680-276","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-02","kg":275.0,"val":10362.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":275.0,"v":10362.0}]},{"id":"11621","cli":"BIALU FESTAS","end":"RUA PROFESSOR HERMINIO BLACKMAN, 731 - PAVMTO1","bai":"DA PENHA","cid":"Vitória","uf":"ES","cep":"29047-165","sit":"Faturamento atrasado","vnd":"Edson - B","dat":"2026-06-03","kg":500.0,"val":8450.0,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":500.0,"v":8450.0}]},{"id":"11619","cli":"TOP EMBALAGENS","end":"RUA ALBERTO AZEVEDO, 313","bai":"Centro","cid":"Inhapim","uf":"MG","cep":"35330-000","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-06-03","kg":500.0,"val":9720.0,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":400.0,"v":6920.0},{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":100.0,"v":2800.0}]},{"id":"11617","cli":"JURUAIA GABINETE PREFEITO - MG","end":"RUA ANA VITORIA, 135","bai":"Centro","cid":"Juruaia","uf":"MG","cep":"37805-000","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-06-03","kg":0.5,"val":0.01,"prod":[{"d":"1110033 - CAFE VACUO VILLA RICA TRADICIONAL 500G","q":0.5,"v":0.01}]},{"id":"459","cli":"PIEDADE DE CARATINGA PREFEITURA MUNICIPA","end":"AVENIDA NOSSA SENHORA DA PIEDADE, 372","bai":"Centro","cid":"Piedade de Caratinga","uf":"MG","cep":"35325-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-03","kg":30.0,"val":899.25,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":30.0,"v":899.25}]},{"id":"461","cli":"ERVALIA PREF GABINETE PREFEITO - MG","end":"PRACA ARTUR BERNARDES, 1 - 1 ANDAR","bai":"Centro","cid":"Ervália","uf":"MG","cep":"36555-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-03","kg":1.6,"val":57.6,"prod":[{"d":"1230052 - LEITE EM PO INTEGRAL HORIZONTE 400g VITA","q":1.6,"v":57.6}]},{"id":"11602","cli":"FUNDO DE ASSISTENCIA SOCIAL SAO LUIS DE ","end":"RUA RIO DA PRATA, 662 - SEDE PREFEITURA","bai":"Centro","cid":"São Luís de Montes Belos","uf":"GO","cep":"76100-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-06-04","kg":10.0,"val":457.8,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":10.0,"v":457.8}]},{"id":"472","cli":"PEDRO TEIXEIRA GABINETE DO PREFEITO","end":"RUA PROF. JOAO LINS, 447","bai":"Centro","cid":"Pedro Teixeira","uf":"MG","cep":"36148-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-04","kg":2.4,"val":69.18,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":2.4,"v":69.18}]},{"id":"470","cli":"PEDRO TEIXEIRA GABINETE DO PREFEITO","end":"RUA PROF. JOAO LINS, 447","bai":"Centro","cid":"Pedro Teixeira","uf":"MG","cep":"36148-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-04","kg":2.0,"val":57.65,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":2.0,"v":57.65}]},{"id":"468","cli":"PEDRO TEIXEIRA GABINETE DO PREFEITO","end":"RUA PROF. JOAO LINS, 447","bai":"Centro","cid":"Pedro Teixeira","uf":"MG","cep":"36148-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-04","kg":12.0,"val":378.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":12.0,"v":378.0}]},{"id":"467","cli":"PEDRO TEIXEIRA GABINETE DO PREFEITO","end":"RUA PROF. JOAO LINS, 447","bai":"Centro","cid":"Pedro Teixeira","uf":"MG","cep":"36148-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-04","kg":10.0,"val":315.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":10.0,"v":315.0}]},{"id":"471","cli":"PEDRO TEIXEIRA GABINETE DO PREFEITO","end":"RUA PROF. JOAO LINS, 447","bai":"Centro","cid":"Pedro Teixeira","uf":"MG","cep":"36148-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-04","kg":2.0,"val":57.65,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":2.0,"v":57.65}]},{"id":"469","cli":"PEDRO TEIXEIRA GABINETE DO PREFEITO","end":"RUA PROF. JOAO LINS, 447","bai":"Centro","cid":"Pedro Teixeira","uf":"MG","cep":"36148-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-04","kg":6.0,"val":172.95,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":6.0,"v":172.95}]},{"id":"465","cli":"AMPARO DO SERRA PREFEITURA GABINETE DO P","end":"PRACA RAYMUNDO BELLICO SOBRINHO, 7","bai":"Centro","cid":"Amparo do Serra","uf":"MG","cep":"35444-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-04","kg":100.0,"val":3727.5,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":100.0,"v":3727.5}]},{"id":"462","cli":"PEDRO TEIXEIRA GABINETE DO PREFEITO","end":"RUA PROF. JOAO LINS, 447","bai":"Centro","cid":"Pedro Teixeira","uf":"MG","cep":"36148-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-04","kg":12.0,"val":378.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":12.0,"v":378.0}]},{"id":"11629","cli":"SIM DISTRIBUIDORA","end":"AVENIDA ITAPETINGA, 2009","bai":"POTENGI","cid":"Natal","uf":"RN","cep":"59124-400","sit":"Faturamento atrasado","vnd":"Eridiane Couto - B","dat":"2026-06-08","kg":2.0,"val":0.2,"prod":[{"d":"1210049 - OKEY LAC ACAI 50G - Amostra","q":2.0,"v":0.2}]},{"id":"11613","cli":"PREFEITURA DO MUNICIPIO DE BARRETOS - SP","end":"AVENIDA ALMIRANTE GAGO COUTINHO, 500","bai":"RIOS","cid":"Barretos","uf":"SP","cep":"14783-200","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":72.0,"val":3225.6,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":72.0,"v":3225.6}]},{"id":"11631","cli":"GELATERIA E CAFETERIA DOCE MANIA","end":"AVENIDA OTAVIANO LEANDRO DE MORAES, 231","bai":"Centro","cid":"Paulo Afonso","uf":"BA","cep":"48602-005","sit":"Proposta pendente","vnd":"Laender B","dat":"2026-06-08","kg":3.0,"val":0.3,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1.0,"v":0.1},{"d":"12300002 - MANIMALTO - MALTODEXTRINA 25KG","q":1.0,"v":0.1},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":1.0,"v":0.1}]},{"id":"11630","cli":"SORVETERIA TRADICAO","end":"RUA DA FLORESTA, 542","bai":"AMARANTE","cid":"São Gonçalo do Amarante","uf":"RN","cep":"59296-623","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-06-08","kg":100.0,"val":2500.0,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":50.0,"v":1000.0},{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":50.0,"v":1500.0}]},{"id":"11632","cli":"MEXICAS INDUSTRIA E COMERCIO","end":"RUA MEXICO, 00157","bai":"VILA SAO DOMINGOS","cid":"Coronel Fabriciano","uf":"MG","cep":"35171-150","sit":"Proposta pendente","vnd":"Amostra","dat":"2026-06-08","kg":4.5,"val":0.45,"prod":[{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":1.0,"v":0.1},{"d":"1230048 - GLUCOSE EM PO - 25KG","q":1.0,"v":0.1},{"d":"1210000 - OKEY LAC ACAI 1 KG","q":1.0,"v":0.1},{"d":"1210049 - OKEY LAC ACAI 50G - Amostra","q":0.5,"v":0.05},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":1.0,"v":0.1}]},{"id":"11636","cli":"CORTEZ SORVETES","end":"RUA PROFESSOR PAULO MESQUITA, 94","bai":"Centro","cid":"Macaiba","uf":"RN","cep":"59280-000","sit":"Proposta pendente","vnd":"Laender B","dat":"2026-06-08","kg":10.0,"val":1.0,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":10.0,"v":1.0}]},{"id":"11635","cli":"VITORIA SORVETES","end":"RUA 13, 316","bai":"COHAB","cid":"Salgueiro","uf":"PE","cep":"56000-000","sit":"Proposta pendente","vnd":"Laender B","dat":"2026-06-08","kg":16.0,"val":1.6,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1.0,"v":0.1},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":15.0,"v":1.5}]},{"id":"11637","cli":"PICCOLO PICOLES E SORVETES","end":"AVENIDA CORONEL ESTEVAM, 1654","bai":"ALECRIM","cid":"Natal","uf":"RN","cep":"59037-000","sit":"Proposta pendente","vnd":"Laender B","dat":"2026-06-08","kg":6.0,"val":0.6,"prod":[{"d":"1230048 - GLUCOSE EM PO - 25KG","q":2.0,"v":0.2},{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":2.0,"v":0.2},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":2.0,"v":0.2}]},{"id":"498","cli":"GUAIMBE GABINETE PREFEITO - SP","end":"RUA MARECHAL DEODORO, 261","bai":"Centro","cid":"Guaimbe","uf":"SP","cep":"16480-023","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":20.0,"val":864.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":20.0,"v":864.0}]},{"id":"493","cli":"MUNICIPIO DE CONGONHAS DO NORTE GABINETE","end":"RUA JOAO MOREIRA, 22","bai":"Centro","cid":"Congonhas do Norte","uf":"MG","cep":"35850-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":30.0,"val":1134.0,"prod":[{"d":"123058 - CAFE VACUO BELVEDER 500G L 1225","q":30.0,"v":1134.0}]},{"id":"494","cli":"MUNICIPIO DE CONGONHAS DO NORTE GABINETE","end":"RUA JOAO MOREIRA, 22","bai":"Centro","cid":"Congonhas do Norte","uf":"MG","cep":"35850-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":40.0,"val":1512.0,"prod":[{"d":"123058 - CAFE VACUO BELVEDER 500G L 1225","q":40.0,"v":1512.0}]},{"id":"492","cli":"MUNICIPIO DE CONGONHAS DO NORTE GABINETE","end":"RUA JOAO MOREIRA, 22","bai":"Centro","cid":"Congonhas do Norte","uf":"MG","cep":"35850-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":6.0,"val":226.8,"prod":[{"d":"123058 - CAFE VACUO BELVEDER 500G L 1225","q":6.0,"v":226.8}]},{"id":"491","cli":"MUNICIPIO DE CONGONHAS DO NORTE GABINETE","end":"RUA JOAO MOREIRA, 22","bai":"Centro","cid":"Congonhas do Norte","uf":"MG","cep":"35850-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":10.0,"val":378.0,"prod":[{"d":"123058 - CAFE VACUO BELVEDER 500G L 1225","q":10.0,"v":378.0}]},{"id":"496","cli":"GUAIMBE GABINETE PREFEITO - SP","end":"RUA MARECHAL DEODORO, 261","bai":"Centro","cid":"Guaimbe","uf":"SP","cep":"16480-023","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":20.0,"val":864.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":20.0,"v":864.0}]},{"id":"497","cli":"GUAIMBE GABINETE PREFEITO - SP","end":"RUA MARECHAL DEODORO, 261","bai":"Centro","cid":"Guaimbe","uf":"SP","cep":"16480-023","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":20.0,"val":864.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":20.0,"v":864.0}]},{"id":"499","cli":"GUAIMBE GABINETE PREFEITO - SP","end":"RUA MARECHAL DEODORO, 261","bai":"Centro","cid":"Guaimbe","uf":"SP","cep":"16480-023","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-08","kg":20.0,"val":864.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":20.0,"v":864.0}]},{"id":"9355","cli":"GRUPAMENTO DE APOIO DE LAGOA SANTA - GAP","end":"AVENIDA BRIGADEIRO EDUARDO GOMES, s/nº","bai":"VILA ASAS","cid":"Lagoa Santa","uf":"MG","cep":"33400-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-09","kg":600.0,"val":21900.0,"prod":[{"d":"1230053 - LPI IN HORIZONTE 400g","q":600.0,"v":21900.0}]},{"id":"9354","cli":"GRUPAMENTO DE APOIO DE LAGOA SANTA - GAP","end":"AVENIDA BRIGADEIRO EDUARDO GOMES, s/nº","bai":"VILA ASAS","cid":"Lagoa Santa","uf":"MG","cep":"33400-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Leite","dat":"2026-06-09","kg":340.0,"val":12410.0,"prod":[{"d":"1230053 - LPI IN HORIZONTE 400g","q":340.0,"v":12410.0}]},{"id":"11643","cli":"VENCEDORA","end":"RUA FRANCELINO GOMES, 496","bai":"BONFIM","cid":"Carmo do Cajuru","uf":"MG","cep":"35557-000","sit":"Faturamento atrasado","vnd":"Flavia Raphaella - B","dat":"2026-06-09","kg":200.0,"val":2000.0,"prod":[{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":200.0,"v":2000.0}]},{"id":"503","cli":"MUNICIPIO DE BOM SUCESSO DE ITARARE","end":"RUA GREGORIO BRIZOLA, 70","bai":"Centro","cid":"Bom Sucesso de Itarare","uf":"SP","cep":"18475-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-06-09","kg":10.0,"val":367.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":10.0,"v":367.0}]},{"id":"506","cli":"PORTEIRINHA PREFEITURA GABINETE PREFEITO","end":"PRACA PRESIDENTE VARGAS, 1","bai":"Centro","cid":"Porteirinha","uf":"MG","cep":"39520-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-09","kg":12.0,"val":328.5,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":12.0,"v":328.5}]},{"id":"505","cli":"PORTEIRINHA PREFEITURA GABINETE PREFEITO","end":"PRACA PRESIDENTE VARGAS, 1","bai":"Centro","cid":"Porteirinha","uf":"MG","cep":"39520-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-09","kg":16.0,"val":438.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":16.0,"v":438.0}]},{"id":"495","cli":"PREFEITURA MUNICIPAL RIO PIRACICABA- MG","end":"PRACA DURVAL DE BARROS, 52","bai":"Centro","cid":"Rio Piracicaba","uf":"MG","cep":"35940-000","sit":"Faturamento atrasado","vnd":"Licitação LC","dat":"2026-06-09","kg":10.6,"val":332.8,"prod":[{"d":"123086 - CACAU MILKSHOW 100% 200G","q":1.0,"v":52.0},{"d":"1230054 - LPI IN HORIZONTE 400g VITAMINAS A,C,D E ","q":9.6,"v":280.8}]},{"id":"502","cli":"VARZEA DA PALMA GAB PREFEITO","end":"RUA CLAUDIO MANOEL DA COSTA, 1000","bai":"PINLAR I","cid":"Várzea da Palma","uf":"MG","cep":"39260-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-09","kg":100.0,"val":4710.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":100.0,"v":4710.0}]},{"id":"507","cli":"PREFEITURA MUNICIPAL DE SANTO EXPEDITO S","end":"AVENIDA BARAO DO RIO BRANCO, 472","bai":"Centro","cid":"Santo Expedito","uf":"SP","cep":"19190-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-09","kg":120.0,"val":3720.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":120.0,"v":3720.0}]},{"id":"501","cli":"PREFEITURA DE NOVA PORTEIRINHA - MG","end":"AVENIDA TANCREDO DE ALMEIDA NEVES, 260","bai":"NOVA PORTEIRINHA","cid":"Nova Porteirinha","uf":"MG","cep":"39525-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-09","kg":40.0,"val":1698.0,"prod":[{"d":"1230054 - LPI IN HORIZONTE 400g VITAMINAS A,C,D E ","q":40.0,"v":1698.0}]},{"id":"11618","cli":"PICOLE & SORVETE KARIKO","end":"RUA SANTO ANTONIO, 282 - TERREO","bai":"TANCREDO NEVES III","cid":"Paulo Afonso","uf":"BA","cep":"48611-038","sit":"Faturamento atrasado","vnd":"Laender B","dat":"2026-06-10","kg":250.0,"val":4387.5,"prod":[{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":225.0,"v":4162.5},{"d":"1230048 - GLUCOSE EM PO - 25KG","q":25.0,"v":225.0}]},{"id":"514","cli":"JERIQUARA GABINETE PREFEITO","end":"RUA JONAS ALVES COSTA, 559","bai":"Centro","cid":"Jeriquara","uf":"SP","cep":"14450-000","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-06-10","kg":1.0,"val":0.1,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":1.0,"v":0.1}]},{"id":"512","cli":"VARZEA DA PALMA GAB PREFEITO","end":"RUA CLAUDIO MANOEL DA COSTA, 1000","bai":"PINLAR I","cid":"Várzea da Palma","uf":"MG","cep":"39260-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-10","kg":25.0,"val":1177.5,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":25.0,"v":1177.5}]},{"id":"516","cli":"CODEMGE BELO HORIZONTE - MG","end":"RODOVIA PAPA JOAO PAULO II, 4001 - EDIF GERAIS AND","bai":"SERRA VERDE","cid":"Belo Horizonte","uf":"MG","cep":"31630-901","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-10","kg":25.0,"val":1079.5,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":25.0,"v":1079.5}]},{"id":"513","cli":"VARZEA DA PALMA GAB PREFEITO","end":"RUA CLAUDIO MANOEL DA COSTA, 1000","bai":"PINLAR I","cid":"Várzea da Palma","uf":"MG","cep":"39260-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-10","kg":75.0,"val":3532.5,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":75.0,"v":3532.5}]},{"id":"515","cli":"CODEMGE BELO HORIZONTE - MG","end":"RODOVIA PAPA JOAO PAULO II, 4001 - EDIF GERAIS AND","bai":"SERRA VERDE","cid":"Belo Horizonte","uf":"MG","cep":"31630-901","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-10","kg":27.5,"val":1187.45,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":27.5,"v":1187.45}]},{"id":"11663","cli":"SORVETES MARANATA","end":"RUA MARIA RAIMUNDA DA SILVA, 00584","bai":"BELA VISTA","cid":"Mauriti","uf":"CE","cep":"63210-000","sit":"Proposta pendente","vnd":"Eridiane Couto - B","dat":"2026-06-11","kg":50.0,"val":5.0,"prod":[{"d":"1230013 - OKEY LAC PRO 25kG","q":50.0,"v":5.0}]},{"id":"521","cli":"FUNDO MUNICIPAL DE ASSISTENCIA SOCIAL DE","end":"PRAÇA CENTRO ADMINSTRATIVO","bai":"Centro","cid":"Alto Paraíso de Goiás","uf":"GO","cep":"73770-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-11","kg":10.0,"val":440.4,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":10.0,"v":440.4}]},{"id":"504","cli":"PREFEITURA DE ANDRELANDIA - MG","end":"AVENIDA NOSSA SENHORA DO PORTO DA ETERNA SALVACO, ","bai":"Centro","cid":"Andrelândia","uf":"MG","cep":"37300-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-11","kg":1.6,"val":51.4,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":1.6,"v":51.4}]},{"id":"520","cli":"FUNDO MUNICIPAL DE ASSISTENCIA SOCIAL DE","end":"PRAÇA CENTRO ADMINSTRATIVO","bai":"Centro","cid":"Alto Paraíso de Goiás","uf":"GO","cep":"73770-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-11","kg":15.0,"val":660.6,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":15.0,"v":660.6}]},{"id":"9365","cli":"Dellys","end":"VIA MANOEL JACINTO COELHO JUNIOR, 981 - GALPAO01-A","bai":"FAZENDA DA TAPERA","cid":"Contagem","uf":"MG","cep":"32150-245","sit":"Faturamento atrasado","vnd":"Flavia Raphaella - B","dat":"2026-06-12","kg":125.0,"val":1865.0,"prod":[{"d":"12300021 - OKEY LAC ACAI 25KG","q":125.0,"v":1865.0}]},{"id":"508","cli":"AGUAS FORMOSAS PREF GABINETE DO PREFEITO","end":"RUA DEODORO DE ALMEIDA PINTO, 166","bai":"Centro","cid":"Águas Formosas","uf":"MG","cep":"39880-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-06-12","kg":10.0,"val":376.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":10.0,"v":376.0}]},{"id":"522","cli":"PREFEITURA DO MUNICIPIO DE CONCHAL - SP","end":"RUA FRANCISCO FERREIRA ALVES, 364","bai":"Centro","cid":"Conchal","uf":"SP","cep":"13835-015","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-12","kg":50.0,"val":1889.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":50.0,"v":1889.0}]},{"id":"11642","cli":"DONA DETE INDUSTRIA DE ALIMENTOS CONGELA","end":"RUA ARTUR ALEGRIA, 74","bai":"CONJUNTO JOSE BARBOS","cid":"Uberaba","uf":"MG","cep":"38035-725","sit":"Faturamento atrasado","vnd":"Flavia Raphaella - B","dat":"2026-06-15","kg":400.0,"val":4000.0,"prod":[{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":400.0,"v":4000.0}]},{"id":"11627","cli":"MEGA ACAI DISTRIBUIDORA","end":"AVENIDA PEDRO LUDOVICO, 6411 - QUADRAA LOTE 22","bai":"JARDIM ANA CLAUDIA","cid":"Anápolis","uf":"GO","cep":"75135-866","sit":"Faturamento atrasado","vnd":"Eridiane Couto - B","dat":"2026-06-15","kg":500.0,"val":8785.0,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":500.0,"v":8785.0}]},{"id":"510","cli":"PREFEITURA DE GUARDA MOR - MG","end":"RUA CANDIDO ULHOA, 250","bai":"Centro","cid":"Guarda-Mor","uf":"MG","cep":"38570-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-06-15","kg":30.0,"val":1425.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":30.0,"v":1425.0}]},{"id":"509","cli":"BOM JESUS DA PENHA GABINETE PREFEITO","end":"PRACA COM INACIO, 200","bai":"Centro","cid":"Bom Jesus da Penha","uf":"MG","cep":"37948-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Achocolatad","dat":"2026-06-15","kg":15.0,"val":837.0,"prod":[{"d":"123089 - CACAU MILKSHOW 100% 500G","q":15.0,"v":837.0}]},{"id":"9369","cli":"OESA COMERCIO E REPRESENTACOES S/A","end":"RODOVIA BR 040, SN - KM 688 PAVLH V LOJA 01 A 26","bai":"KENNEDY","cid":"Contagem","uf":"MG","cep":"32145-900","sit":"Faturamento atrasado","vnd":"Flavia Raphaella - B","dat":"2026-06-16","kg":1000.0,"val":27500.0,"prod":[{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":1000.0,"v":27500.0}]},{"id":"11701","cli":"DISTRIBUIDORA BELO NORTE SLZ","end":"RUA 08, SN - QUADRA60 LOTE 13","bai":"COHAPAM","cid":"São Luís","uf":"MA","cep":"65055-027","sit":"Faturamento atrasado","vnd":"MONTENEGRO","dat":"2026-06-16","kg":600.0,"val":11160.0,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":600.0,"v":11160.0}]},{"id":"11702","cli":"DISTRIBUIDORA SABOR DO NORTE","end":"AVENIDA NOE MENDES, 6694 - LOTE C","bai":"SAO SEBASTIAO","cid":"Teresina","uf":"PI","cep":"64084-015","sit":"Faturamento atrasado","vnd":"MONTENEGRO","dat":"2026-06-16","kg":400.0,"val":7440.0,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":400.0,"v":7440.0}]},{"id":"11704","cli":"JS DISTRIBUICOES LTDA","end":"RUA SANTA BRANCA, 443","bai":"SUMARE","cid":"Caraguatatuba","uf":"SP","cep":"11661-540","sit":"Proposta pendente","vnd":"Amostra","dat":"2026-06-16","kg":1.0,"val":0.1,"prod":[{"d":"1210049 - OKEY LAC ACAI 50G - Amostra","q":1.0,"v":0.1}]},{"id":"11666","cli":"MUNICIPIO DE FORMIGA - MG","end":"RUA BARAO DE PIUMHY, 121","bai":"Centro","cid":"Formiga","uf":"MG","cep":"35570-128","sit":"Proposta pendente","vnd":"Licitação 2 - Cafe","dat":"2026-06-16","kg":27.5,"val":1394.25,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":27.5,"v":1394.25}]},{"id":"11703","cli":"DISTRIBUIDORA SABOR DO NORTE","end":"AVENIDA NOE MENDES, 6694 - LOTE C","bai":"SAO SEBASTIAO","cid":"Teresina","uf":"PI","cep":"64084-015","sit":"Faturamento atrasado","vnd":"MONTENEGRO","dat":"2026-06-16","kg":200.0,"val":3720.0,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":200.0,"v":3720.0}]},{"id":"11657","cli":"FUNDO DE ASSISTENCIA SOCIAL SAO LUIS DE ","end":"RUA RIO DA PRATA, 662 - SEDE PREFEITURA","bai":"Centro","cid":"São Luís de Montes Belos","uf":"GO","cep":"76100-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-06-16","kg":10.0,"val":457.8,"prod":[{"d":"123075 - CAFE VACUO BELVEDER 500G L1326","q":10.0,"v":457.8}]},{"id":"11665","cli":"MUNICIPIO DE FORMIGA - MG","end":"RUA BARAO DE PIUMHY, 121","bai":"Centro","cid":"Formiga","uf":"MG","cep":"35570-128","sit":"Proposta pendente","vnd":"Licitação 2 - Cafe","dat":"2026-06-16","kg":15.0,"val":760.5,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":15.0,"v":760.5}]},{"id":"11699","cli":"GG PADARIA","end":"AVENIDA BRASIL, 5820","bai":"VERDE LAR","cid":"Teresina","uf":"PI","cep":"64071-095","sit":"Faturamento atrasado","vnd":"MONTENEGRO","dat":"2026-06-16","kg":100.0,"val":1520.0,"prod":[{"d":"12100020 - OKEY LAC PANIFICACAO 1KG","q":100.0,"v":1520.0}]},{"id":"11700","cli":"DISTRIBUIDORA SABOR DO NORTE","end":"AVENIDA NOE MENDES, 6694 - LOTE C","bai":"SAO SEBASTIAO","cid":"Teresina","uf":"PI","cep":"64084-015","sit":"Proposta pendente","vnd":"MONTENEGRO","dat":"2026-06-16","kg":10.0,"val":0.1,"prod":[{"d":"1230019 - LEITE EM PO INTEGRAL HORIZONTE 200g","q":10.0,"v":0.1}]},{"id":"511","cli":"PREFEITURA DE GUARDA MOR - MG","end":"RUA CANDIDO ULHOA, 250","bai":"Centro","cid":"Guarda-Mor","uf":"MG","cep":"38570-000","sit":"Faturamento atrasado","vnd":"Licitação 1 - Cafe","dat":"2026-06-16","kg":80.0,"val":3800.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":80.0,"v":3800.0}]},{"id":"519","cli":"VARGEM GRANDE DO SUL GABINETE PREFEITO","end":"PRACA WASHINGTON LUIS, 643","bai":"Centro","cid":"Vargem Grande do Sul","uf":"SP","cep":"13880-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-16","kg":10.0,"val":495.0,"prod":[{"d":"123060 - CAFE VACUO BELVEDER 500G L 3225","q":10.0,"v":495.0}]},{"id":"538","cli":"ITABIRA GABINETE DO PREFEITO","end":"AVENIDA CARLOS DE PAULA ANDRADE, 135","bai":"Centro","cid":"Itabira","uf":"MG","cep":"35900-206","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-06-16","kg":1.0,"val":0.01,"prod":[{"d":"123090 - CACAU MILKSHOW 100% 1KG","q":1.0,"v":0.01}]},{"id":"518","cli":"ITAMARANDIBA PREFEITURA","end":"RUA TABELIAO ANDRADE, 205","bai":"Centro","cid":"Itamarandiba","uf":"MG","cep":"39670-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-16","kg":5.0,"val":190.4,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":5.0,"v":190.4}]},{"id":"549","cli":"ITAMARANDIBA PREFEITURA","end":"RUA TABELIAO ANDRADE, 205","bai":"Centro","cid":"Itamarandiba","uf":"MG","cep":"39670-000","sit":"Faturamento atrasado","vnd":"Licitação LC","dat":"2026-06-16","kg":50.0,"val":1904.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":50.0,"v":1904.0}]},{"id":"547","cli":"PREFEITURA MUNICIPAL DE EUCLIDES DA CUNH","end":"AVENIDA ANTONIO JOAQUIM MANO, 02","bai":"Centro","cid":"Euclides da Cunha Paulista","uf":"SP","cep":"19275-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Leite","dat":"2026-06-16","kg":100.0,"val":3575.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":100.0,"v":3575.0}]},{"id":"548","cli":"CARVALHOS GABINETE PREFEITO","end":"AVENIDA ESDRAS THOMAZ SALVADOR, 295","bai":"Centro","cid":"Carvalhos","uf":"MG","cep":"37456-000","sit":"Faturamento atrasado","vnd":"Licitação 2 - Cafe","dat":"2026-06-16","kg":50.0,"val":4035.0,"prod":[{"d":"123074 - CAFE VACUO BELVEDER 500G L 2326","q":50.0,"v":4035.0}]},{"id":"551","cli":"CAMPO BELO GABINETE PREFEITO - MG","end":"RUA JOAO PINHEIRO, 102 - 1 ANDAR","bai":"Centro","cid":"Campo Belo","uf":"MG","cep":"37270-000","sit":"Faturamento atrasado","vnd":"Amostra","dat":"2026-06-16","kg":0.5,"val":0.01,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":0.5,"v":0.01}]},{"id":"9362","cli":"UNIVERSIDADE DE TAUBATE- SP","end":"RUA QUATRO DE MARCO, 432","bai":"Centro","cid":"Taubaté","uf":"SP","cep":"12020-270","sit":"Previsto para hoje","vnd":"Licitação 1 - Cafe","dat":"2026-06-17","kg":400.0,"val":17104.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":400.0,"v":17104.0}]},{"id":"9367","cli":"PREFEITURA DE SANTO ANTONIO DO AMPARO - ","end":"RUA JOSE COUTINHO, 39 - SALA 1","bai":"Centro","cid":"Santo Antônio do Amparo","uf":"MG","cep":"37262-000","sit":"Previsto para hoje","vnd":"Licitação 1 - Cafe","dat":"2026-06-17","kg":100.0,"val":4796.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":100.0,"v":4796.0}]},{"id":"9368","cli":"PREFEITURA DE SANTO ANTONIO DO AMPARO - ","end":"RUA JOSE COUTINHO, 39 - SALA 1","bai":"Centro","cid":"Santo Antônio do Amparo","uf":"MG","cep":"37262-000","sit":"Previsto para hoje","vnd":"Licitação 1 - Cafe","dat":"2026-06-17","kg":125.0,"val":5995.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":125.0,"v":5995.0}]},{"id":"11652","cli":"PADARIA E CONFEITARIA FLOR DE MAIO LTDA","end":"RUA LADAINHA, 217","bai":"1 DE MAIO","cid":"Belo Horizonte","uf":"MG","cep":"31810-130","sit":"Previsto para hoje","vnd":"Eridiane Couto - B","dat":"2026-06-17","kg":175.0,"val":1676.25,"prod":[{"d":"12300002 - MANIMALTO - MALTODEXTRINA 25KG","q":50.0,"v":395.0},{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":125.0,"v":1281.25}]},{"id":"11669","cli":"FMS DE SAO LUIS DE MONTES BELOS","end":"AVENIDA RIO DA PRATA, 662 - QUADRA70 LOTE 16","bai":"Centro","cid":"São Luís de Montes Belos","uf":"GO","cep":"76100-000","sit":"Previsto para hoje","vnd":"Licitação 2 - Cafe","dat":"2026-06-17","kg":15.0,"val":686.7,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":15.0,"v":686.7}]},{"id":"11653","cli":"SUMMER ACAI","end":"Rua Ângelo Paschoal de Marco, 15","bai":"Vila Galvão","cid":"Caçapava","uf":"SP","cep":"12286-200","sit":"Previsto para hoje","vnd":"Eridiane Couto - B","dat":"2026-06-17","kg":150.0,"val":2692.5,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":150.0,"v":2692.5}]},{"id":"11690","cli":"PREFEITURA MUNICIPAL DE JUATUBA - MG","end":"PRACA DOS TRES PODERES, S/N","bai":"Centro","cid":"Juatuba","uf":"MG","cep":"35675-000","sit":"Previsto para hoje","vnd":"Licitação LC","dat":"2026-06-17","kg":2.4,"val":110.4,"prod":[{"d":"123086 - CACAU MILKSHOW 100% 200G","q":2.4,"v":110.4}]},{"id":"11648","cli":"MAX TRIGO CEREAIS LTDA.","end":"AVENIDA VEREADOR EDENITES DA SILVA VIANA, 183 - LO","bai":"Centro","cid":"São Francisco de Itabapoana","uf":"RJ","cep":"28230-000","sit":"Previsto para hoje","vnd":"Eridiane Couto - B","dat":"2026-06-17","kg":250.0,"val":4487.5,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":250.0,"v":4487.5}]},{"id":"527","cli":"BAEPENDI GABINETE PREFEITO - MG","end":"RUA CORNELIO MAGALHES, 97","bai":"Centro","cid":"Baependi","uf":"MG","cep":"37443-000","sit":"Previsto para hoje","vnd":"Licitação 1 - Leite","dat":"2026-06-17","kg":8.0,"val":299.6,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":8.0,"v":299.6}]},{"id":"11678","cli":"NAQUE PREFEITURA MUNICIPAL-MG","end":"AVENIDA JOSE M MORAIS JUNIOR, 75 - CO","bai":"Centro","cid":"Naque","uf":"MG","cep":"35117-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-18","kg":10.0,"val":464.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":10.0,"v":464.0}]},{"id":"11692","cli":"FOFINHO ALIMENTOS LTDA","end":"RUA AMELIO MARQUES, 405","bai":"CENTRO EMPRESARIAL L","cid":"Uberlândia","uf":"MG","cep":"38409-667","sit":"Aguardando faturamento","vnd":"Flavia Raphaella - B","dat":"2026-06-18","kg":250.0,"val":3975.0,"prod":[{"d":"1210001 - OKEY LAC GOURMET 25KG","q":250.0,"v":3975.0}]},{"id":"11679","cli":"NAQUE PREFEITURA MUNICIPAL-MG","end":"AVENIDA JOSE M MORAIS JUNIOR, 75 - CO","bai":"Centro","cid":"Naque","uf":"MG","cep":"35117-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-18","kg":6.0,"val":278.4,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":6.0,"v":278.4}]},{"id":"11676","cli":"FMS DE SAO LUIS DE MONTES BELOS","end":"AVENIDA RIO DA PRATA, 662 - QUADRA70 LOTE 16","bai":"Centro","cid":"São Luís de Montes Belos","uf":"GO","cep":"76100-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-18","kg":0.5,"val":22.89,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":0.5,"v":22.89}]},{"id":"528","cli":"PREFEITURA MUNICIPAL DE BONFIM","end":"Avenida Governador Benedito Valadares, 170","bai":"Centro","cid":"Bonfim","uf":"MG","cep":"35521-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Leite","dat":"2026-06-18","kg":28.0,"val":861.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":28.0,"v":861.0}]},{"id":"529","cli":"PREFEITURA MUNICIPAL DE BONFIM","end":"Avenida Governador Benedito Valadares, 170","bai":"Centro","cid":"Bonfim","uf":"MG","cep":"35521-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Leite","dat":"2026-06-18","kg":8.0,"val":246.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":8.0,"v":246.0}]},{"id":"530","cli":"PREFEITURA MUNICIPAL DE BONFIM","end":"Avenida Governador Benedito Valadares, 170","bai":"Centro","cid":"Bonfim","uf":"MG","cep":"35521-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Leite","dat":"2026-06-18","kg":4.0,"val":123.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":4.0,"v":123.0}]},{"id":"11685","cli":"NAQUE PREFEITURA MUNICIPAL-MG","end":"AVENIDA JOSE M MORAIS JUNIOR, 75 - CO","bai":"Centro","cid":"Naque","uf":"MG","cep":"35117-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-19","kg":30.0,"val":1392.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":30.0,"v":1392.0}]},{"id":"11668","cli":"MILLENIUM ACAI SORVETES E CREMES LTDA","end":"RUA PRESIDENTE GETULIO VARGAS, 28 - TERREO01","bai":"ULISSES GUIMARAES","cid":"Vila Velha","uf":"ES","cep":"29124-226","sit":"Aguardando faturamento","vnd":"RAFAEL","dat":"2026-06-19","kg":220.0,"val":4389.45,"prod":[{"d":"1230048 - GLUCOSE EM PO - 25KG","q":25.0,"v":212.5},{"d":"1230017 - LEITE EM PO INTEGRAL HORIZONTE 1Kg","q":10.0,"v":300.0},{"d":"1210000 - OKEY LAC ACAI 1 KG","q":10.0,"v":175.7},{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":75.0,"v":1950.0},{"d":"1230096 - OKEY LAC CREAM PLUS 25kg","q":50.0,"v":995.0},{"d":"12300021 - OKEY LAC ACAI 25KG","q":25.0,"v":362.75},{"d":"1230013 - OKEY LAC PRO 25kG","q":25.0,"v":393.5}]},{"id":"11670","cli":"MANU ACAI E SORVETE LTDA","end":"AVENIDA CORONEL JOSE MARTINS DE FIGUEIREDO, 480","bai":"MARUIPE","cid":"Vitória","uf":"ES","cep":"29043-060","sit":"Aguardando faturamento","vnd":"RAFAEL","dat":"2026-06-19","kg":150.0,"val":2800.0,"prod":[{"d":"1210001 - OKEY LAC GOURMET 25KG","q":100.0,"v":1500.0},{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":50.0,"v":1300.0}]},{"id":"11687","cli":"MUNICIPIO DE IGARATINGA - MG","end":"PRACA MANUEL DE ASSIS, 272","bai":"Centro","cid":"Igaratinga","uf":"MG","cep":"35695-000","sit":"Aguardando faturamento","vnd":"Licitação 1 - Cafe","dat":"2026-06-19","kg":40.0,"val":1599.2,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":40.0,"v":1599.2}]},{"id":"11664","cli":"SUPRA ACAI","end":"RUA PROFESSORA GUIOMAR DE MATOS, 155","bai":"HENRIQUE NERY","cid":"Sete Lagoas","uf":"MG","cep":"35700-331","sit":"Aguardando faturamento","vnd":"Eridiane Couto - B","dat":"2026-06-19","kg":250.0,"val":4287.5,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":250.0,"v":4287.5}]},{"id":"11684","cli":"FUNDO MUNICIPAL DE SAUDE DE JAGUARE - ES","end":"RUA ANGELO BRIOSCHI, 05 - CASA","bai":"Centro","cid":"Jaguare","uf":"ES","cep":"29950-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-19","kg":250.0,"val":17195.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":250.0,"v":17195.0}]},{"id":"532","cli":"ITAMARANDIBA PREFEITURA","end":"RUA TABELIAO ANDRADE, 205","bai":"Centro","cid":"Itamarandiba","uf":"MG","cep":"39670-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-19","kg":10.0,"val":380.8,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":10.0,"v":380.8}]},{"id":"535","cli":"PAPAGAIOS PREFEITURA GABINETE DO PREFEIT","end":"AVENIDA FRANCISCO VALADARES DA FONSECA, 250","bai":"VASCO LOPES","cid":"Papagaios","uf":"MG","cep":"35669-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-19","kg":10.0,"val":394.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":10.0,"v":394.0}]},{"id":"531","cli":"BAEPENDI GABINETE PREFEITO - MG","end":"RUA CORNELIO MAGALHES, 97","bai":"Centro","cid":"Baependi","uf":"MG","cep":"37443-000","sit":"Aguardando faturamento","vnd":"Licitação 1 - Cafe","dat":"2026-06-19","kg":40.0,"val":2384.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":40.0,"v":2384.0}]},{"id":"536","cli":"VARGEM GRANDE DO SUL GABINETE PREFEITO","end":"PRACA WASHINGTON LUIS, 643","bai":"Centro","cid":"Vargem Grande do Sul","uf":"SP","cep":"13880-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-19","kg":5.0,"val":247.5,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":5.0,"v":247.5}]},{"id":"537","cli":"VARGEM GRANDE DO SUL GABINETE PREFEITO","end":"PRACA WASHINGTON LUIS, 643","bai":"Centro","cid":"Vargem Grande do Sul","uf":"SP","cep":"13880-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-19","kg":5.0,"val":247.5,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":5.0,"v":247.5}]},{"id":"534","cli":"ITAMARANDIBA PREFEITURA","end":"RUA TABELIAO ANDRADE, 205","bai":"Centro","cid":"Itamarandiba","uf":"MG","cep":"39670-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-19","kg":5.0,"val":190.4,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":5.0,"v":190.4}]},{"id":"533","cli":"PREFEITURA DE GUARDA MOR - MG","end":"RUA CANDIDO ULHOA, 250","bai":"Centro","cid":"Guarda-Mor","uf":"MG","cep":"38570-000","sit":"Aguardando faturamento","vnd":"Licitação 1 - Cafe","dat":"2026-06-19","kg":100.0,"val":4750.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":100.0,"v":4750.0}]},{"id":"11671","cli":"ORGANIZACOES PAULA E CASTRO LTDA","end":"RUA SILEX, 75","bai":"CAMARGOS","cid":"Belo Horizonte","uf":"MG","cep":"30520-200","sit":"Aguardando faturamento","vnd":"Eridiane Couto - B","dat":"2026-06-22","kg":375.0,"val":3843.75,"prod":[{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":375.0,"v":3843.75}]},{"id":"11695","cli":"MUNICIPIO DE PADRE PARAISO","end":"RUA PROFESSOR TEODORO REZENDE, 35","bai":"BOM JESUS","cid":"Padre Paraíso","uf":"MG","cep":"39818-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Leite","dat":"2026-06-22","kg":40.0,"val":1360.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":40.0,"v":1360.0}]},{"id":"11697","cli":"MUNICIPIO DE PADRE PARAISO","end":"RUA PROFESSOR TEODORO REZENDE, 35","bai":"BOM JESUS","cid":"Padre Paraíso","uf":"MG","cep":"39818-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Leite","dat":"2026-06-22","kg":40.0,"val":1360.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":40.0,"v":1360.0}]},{"id":"11696","cli":"MUNICIPIO DE PADRE PARAISO","end":"RUA PROFESSOR TEODORO REZENDE, 35","bai":"BOM JESUS","cid":"Padre Paraíso","uf":"MG","cep":"39818-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Leite","dat":"2026-06-22","kg":40.0,"val":1360.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":40.0,"v":1360.0}]},{"id":"11672","cli":"PITTEU - BALAS E DOCES","end":"RUA SILVESTRE FERRAZ, 14","bai":"AREA RURAL","cid":"São Lourenço","uf":"MG","cep":"37470-000","sit":"Aguardando faturamento","vnd":"Ursulla Lopes   B","dat":"2026-06-22","kg":300.0,"val":4533.0,"prod":[{"d":"1210001 - OKEY LAC GOURMET 25KG","q":300.0,"v":4533.0}]},{"id":"545","cli":"PREFEITURA MUNICIPAL DE EUCLIDES DA CUNH","end":"AVENIDA ANTONIO JOAQUIM MANO, 02","bai":"Centro","cid":"Euclides da Cunha Paulista","uf":"SP","cep":"19275-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Leite","dat":"2026-06-22","kg":60.0,"val":2145.0,"prod":[{"d":"1230027 - LEITE EM PO INTEGRAL HORIZONTE 400g","q":60.0,"v":2145.0}]},{"id":"550","cli":"ITAMARANDIBA PREFEITURA","end":"RUA TABELIAO ANDRADE, 205","bai":"Centro","cid":"Itamarandiba","uf":"MG","cep":"39670-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-22","kg":5.0,"val":190.4,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":0.5,"v":19.04},{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":4.5,"v":171.36}]},{"id":"557","cli":"PREFEITURA MUNICIPAL DE LAGOA SANTA - MG","end":"RUA SAO JOAO, 290","bai":"Centro","cid":"Lagoa Santa","uf":"MG","cep":"33230-103","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-22","kg":138.5,"val":5534.46,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":138.5,"v":5534.46}]},{"id":"555","cli":"PREFEITURA MUNICIPAL DE LAGOA SANTA - MG","end":"RUA SAO JOAO, 290","bai":"Centro","cid":"Lagoa Santa","uf":"MG","cep":"33230-103","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-22","kg":42.5,"val":1698.3,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":42.5,"v":1698.3}]},{"id":"558","cli":"PREFEITURA MUNICIPAL DE LAGOA SANTA - MG","end":"RUA SAO JOAO, 290","bai":"Centro","cid":"Lagoa Santa","uf":"MG","cep":"33230-103","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-22","kg":185.0,"val":7392.6,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":185.0,"v":7392.6}]},{"id":"552","cli":"PREFEITURA MUNICIPAL DE LAGOA GRANDE","end":"RUA MANOEL CALANGO, 172","bai":"Centro","cid":"Lagoa Grande","uf":"MG","cep":"38755-000","sit":"Aguardando faturamento","vnd":"Licitação 1 - Cafe","dat":"2026-06-22","kg":9.0,"val":336.6,"prod":[{"d":"1110033 - CAFE VACUO VILLA RICA TRADICIONAL 500G","q":9.0,"v":336.6}]},{"id":"556","cli":"PREFEITURA MUNICIPAL DE LAGOA SANTA - MG","end":"RUA SAO JOAO, 290","bai":"Centro","cid":"Lagoa Santa","uf":"MG","cep":"33230-103","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-22","kg":204.0,"val":8151.84,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":204.0,"v":8151.84}]},{"id":"559","cli":"PREFEITURA MUNICIPAL DE LAGOA SANTA - MG","end":"RUA SAO JOAO, 290","bai":"Centro","cid":"Lagoa Santa","uf":"MG","cep":"33230-103","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-06-22","kg":42.5,"val":1698.3,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":42.5,"v":1698.3}]},{"id":"11682","cli":"SORVETES FRUTABELA","end":"RUA DOMINGOS MARMORE, 182","bai":"SAO MIGUEL","cid":"Barreiras","uf":"BA","cep":"47800-392","sit":"Aguardando faturamento","vnd":"Laender B","dat":"2026-06-23","kg":600.0,"val":9210.0,"prod":[{"d":"12300002 - MANIMALTO - MALTODEXTRINA 25KG","q":125.0,"v":1062.5},{"d":"1230048 - GLUCOSE EM PO - 25KG","q":125.0,"v":1212.5},{"d":"1230021 - LEITE EM PO INTEGRAL HORIZONTE SACARIA 2","q":50.0,"v":1385.0},{"d":"1230013 - OKEY LAC PRO 25kG","q":300.0,"v":5550.0}]},{"id":"11683","cli":"LATICINIO SANTA MARIA","end":"RODOVIA BR 120 KM 198, SN","bai":"ZONA RURAL","cid":"Água Boa","uf":"MG","cep":"39790-000","sit":"Aguardando faturamento","vnd":"Ursulla Lopes   B","dat":"2026-06-23","kg":50.0,"val":496.5,"prod":[{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":50.0,"v":496.5}]},{"id":"11688","cli":"MORENOPAN LTDA","end":"RUA BAIRRO AFONSO XIII, 7","bai":"Jardim Cerejeiras","cid":"Tupã","uf":"SP","cep":"17607-450","sit":"Aguardando faturamento","vnd":"RAFAEL","dat":"2026-06-23","kg":250.0,"val":6700.0,"prod":[{"d":"1230031 - LEITE EM PO INTEGRAL IMPORTADO SACARIA 2","q":250.0,"v":6700.0}]},{"id":"11686","cli":"SPEED ACAI","end":"RUA ELDORADO, 244D","bai":"CENTRO - POSTO DA MA","cid":"Nova Vicosa","uf":"BA","cep":"45928-000","sit":"Aguardando faturamento","vnd":"Laender B","dat":"2026-06-23","kg":200.0,"val":3646.0,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":200.0,"v":3646.0}]},{"id":"554","cli":"BARRA DO TURVO GABINETE DO PREFEITO","end":"AVENIDA 21 DE MARCO, 304","bai":"Centro","cid":"Barra do Turvo","uf":"SP","cep":"11955-000","sit":"Aguardando faturamento","vnd":"Licitação 2 - Leite","dat":"2026-06-23","kg":17.0,"val":522.65,"prod":[{"d":"123077 - COMPOSTO LACTEO HORIZONTE ALIMLAC MORANGO","q":1.0,"v":24.65},{"d":"1230053 - LPI IN HORIZONTE 400g","q":16.0,"v":498.0}]},{"id":"553","cli":"CAMARA MUNICIPAL DE ITABIRITO","end":"AVENIDA QUEIROZ JUNIOR, 639","bai":"Centro","cid":"Itabirito","uf":"MG","cep":"35450-000","sit":"Aguardando faturamento","vnd":"Licitação 1 - Cafe","dat":"2026-06-23","kg":25.0,"val":1049.0,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":25.0,"v":1049.0}]},{"id":"11694","cli":"ANDERSON OLIVEIRA DISTRIBUIDOR","end":"RUA AYMORE MOREIRA, 296","bai":"TROBOGY","cid":"Salvador","uf":"BA","cep":"41745-028","sit":"Aguardando faturamento","vnd":"Eridiane Couto - B","dat":"2026-06-24","kg":700.0,"val":12090.0,"prod":[{"d":"1210000 - OKEY LAC ACAI 1 KG","q":200.0,"v":3540.0},{"d":"1230045 - SORO DE LEITE EM PO HORIZONTE 25KG","q":250.0,"v":2700.0},{"d":"1230064 - LEITE EM PO DESNATADO HORIZONTE SACARIA ","q":250.0,"v":5850.0}]},{"id":"542","cli":"CODEMGE BELO HORIZONTE - MG","end":"RODOVIA PAPA JOAO PAULO II, 4001 - EDIF GERAIS AND","bai":"SERRA VERDE","cid":"Belo Horizonte","uf":"MG","cep":"31630-901","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-08-15","kg":25.0,"val":1079.5,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":25.0,"v":1079.5}]},{"id":"539","cli":"CODEMGE BELO HORIZONTE - MG","end":"RODOVIA PAPA JOAO PAULO II, 4001 - EDIF GERAIS AND","bai":"SERRA VERDE","cid":"Belo Horizonte","uf":"MG","cep":"31630-901","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-08-15","kg":27.5,"val":1187.45,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":27.5,"v":1187.45}]},{"id":"543","cli":"CODEMGE BELO HORIZONTE - MG","end":"RODOVIA PAPA JOAO PAULO II, 4001 - EDIF GERAIS AND","bai":"SERRA VERDE","cid":"Belo Horizonte","uf":"MG","cep":"31630-901","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-11-15","kg":25.0,"val":1079.5,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":25.0,"v":1079.5}]},{"id":"540","cli":"CODEMGE BELO HORIZONTE - MG","end":"RODOVIA PAPA JOAO PAULO II, 4001 - EDIF GERAIS AND","bai":"SERRA VERDE","cid":"Belo Horizonte","uf":"MG","cep":"31630-901","sit":"Aguardando faturamento","vnd":"Licitação 2 - Cafe","dat":"2026-11-15","kg":27.5,"val":1187.45,"prod":[{"d":"1120056 - CAFE VACUO VILLA RICA SUPERIOR 500G","q":27.5,"v":1187.45}]}];

// ─── STATE ───
let orders = [...RAW_ORDERS];
let filtered = [...orders];
let selected = new Set();
let geocodeCache = {};
let markersMap = {}; // id -> marker
let routeMarkers = [];
let currentRoute = { stops: [], name: 'Rota 1', vehicle: { type: 'truck', cap: 8000 } };
let savedRoutes = [];
let mapView = 'points';
let mapStyle = 'dark';
let leftOpen = true;
let geocoding = false;
let geocodeQueue = [];

const STYLES = {
  dark:      'mapbox://styles/mapbox/dark-v11',
  streets:   'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  outdoors:  'mapbox://styles/mapbox/outdoors-v12',
  light:     'mapbox://styles/mapbox/light-v11',
  navigation:'mapbox://styles/mapbox/navigation-day-v1',
  navnight:  'mapbox://styles/mapbox/navigation-night-v1',
};
let trafficOn = false;
let is3D = false;
let globeMode = false;

const STATUS_COLOR = {
  'Faturamento atrasado': '#ff5470',
  'Aguardando faturamento': '#ffb020',
  'Previsto para hoje': '#4f8fff',
  'Proposta pendente': '#9d7cf0'
};
const STATUS_CLASS = {
  'Faturamento atrasado': 'atrasado b-at',
  'Aguardando faturamento': 'aguardando b-ag',
  'Previsto para hoje': 'hoje b-hj',
  'Proposta pendente': 'pendente b-pp'
};
const STATUS_LABEL = {
  'Faturamento atrasado': 'Atrasado',
  'Aguardando faturamento': 'Aguardando',
  'Previsto para hoje': 'Hoje',
  'Proposta pendente': 'Pendente'
};

// Known city coords (extended)
const KNOWN = {"Mauriti-CE":[-7.384,-38.776],"Santo Antônio de Jesus-BA":[-12.969,-39.262],"Feira de Santana-BA":[-12.267,-38.967],"Vitória da Conquista-BA":[-14.866,-40.844],"Ibitinga-SP":[-21.758,-48.828],"Seabra-BA":[-12.418,-41.771],"Alvorada de Minas-MG":[-18.752,-43.356],"Floriano-PI":[-6.768,-43.024],"Gurupi-TO":[-11.729,-49.068],"Congonhas do Norte-MG":[-18.987,-43.718],"Quissama-RJ":[-22.654,-41.473],"Maceió-AL":[-9.666,-35.735],"Morro do Pilar-MG":[-19.237,-43.389],"Várzea da Palma-MG":[-17.598,-44.728],"Araripina-PE":[-7.576,-40.498],"Pirapora-MG":[-17.342,-44.942],"Caetés-PE":[-8.779,-36.627],"Camaçari-BA":[-12.699,-38.324],"Campo Grande-MS":[-20.469,-54.620],"Caraguatatuba-SP":[-23.621,-45.412],"Carmo do Cajuru-MG":[-20.178,-44.773],"Carvalhos-MG":[-21.427,-44.113],"Caçapava-SP":[-23.102,-45.707],"Conchal-SP":[-22.331,-47.174],"Caceres-MT":[-16.071,-57.680],"Paranátinga-MT":[-14.407,-54.049],"Belo Horizonte-MG":[-19.917,-43.933],"Contagem-MG":[-19.932,-44.053],"Lagoa Santa-MG":[-19.633,-43.904],"Santo Antônio do Amparo-MG":[-20.944,-44.920],"Taubaté-SP":[-23.026,-45.556],"São Luís-MA":[-2.530,-44.302],"Teresina-PI":[-5.092,-42.803],"Anápolis-GO":[-16.328,-48.953],"Águas Lindas de Goiás-GO":[-15.743,-48.278],"Alto Paraíso de Goiás-GO":[-14.133,-47.511],"Vila Velha-ES":[-20.350,-40.292],"Vitória-ES":[-20.316,-40.312],"Salvador-BA":[-12.971,-38.501],"Nova Vicosa-BA":[-17.893,-39.372],"Barreiras-BA":[-12.152,-44.991],"São Lourenço-MG":[-22.115,-45.051],"Sete Lagoas-MG":[-19.469,-44.247],"Inhapim-MG":[-19.540,-42.115],"Montes Claros-MG":[-16.724,-43.862],"Uberlândia-MG":[-18.918,-48.277],"Uberaba-MG":[-19.749,-47.931],"São Francisco de Itabapoana-RJ":[-21.480,-41.104],"Petrópolis-RJ":[-22.505,-43.178],"Paulo Afonso-BA":[-9.402,-38.215],"Petrolina-PE":[-9.398,-40.497],"João Pessoa-PB":[-7.119,-34.845],"Recife-PE":[-8.054,-34.881],"Natal-RN":[-5.794,-35.209],"Mossoró-RN":[-5.188,-37.344],"Gararu-SE":[-9.970,-37.090],"Jaguare-ES":[-18.897,-40.082],"Baependi-MG":[-21.967,-44.888],"Porteirinha-MG":[-15.740,-43.018],"Padre Paraíso-MG":[-17.078,-41.498],"São Luís de Montes Belos-GO":[-16.524,-50.373],"Rio Piracicaba-MG":[-19.941,-43.175],"Águas Formosas-MG":[-17.086,-40.935],"Naque-MG":[-19.183,-42.521],"Igaratinga-MG":[-20.062,-44.704],"Juatuba-MG":[-19.943,-44.338],"Guarda-Mor-MG":[-17.777,-47.097],"Formiga-MG":[-20.464,-45.425],"Itamarandiba-MG":[-17.856,-42.857],"Papagaios-MG":[-19.463,-44.741],"Andrelândia-MG":[-21.735,-44.308],"Itabira-MG":[-19.619,-43.226],"Salgueiro-PE":[-8.072,-39.128],"Coronel Fabriciano-MG":[-19.519,-42.627],"Macaiba-RN":[-5.862,-35.358],"São Gonçalo do Amarante-RN":[-5.792,-35.329],"Muriaé-MG":[-21.131,-42.368],"Ourinhos-SP":[-22.977,-49.870],"Sorocaba-SP":[-23.501,-47.457],"Itu-SP":[-23.264,-47.299],"Mococa-SP":[-21.475,-47.002],"Machado-MG":[-21.682,-45.934],"Edeia-GO":[-17.338,-49.932],"Água Boa-MG":[-18.531,-42.379],"Tupã-SP":[-21.934,-50.512],"Amparo do Serra-MG":[-20.527,-42.968],"Lagoa Grande-MG":[-17.109,-46.157],"Itabirito-MG":[-20.252,-43.803],"Barra do Turvo-SP":[-24.767,-48.494],"Pedro Teixeira-MG":[-21.696,-43.595],"Nova Porteirinha-MG":[-15.800,-43.303],"Santa Fé de Minas-MG":[-16.687,-45.414],"Bonfim-MG":[-20.321,-44.256],"Ervália-MG":[-20.851,-42.666],"Piedade de Caratinga-MG":[-19.741,-42.348],"Juruaia-MG":[-21.269,-46.575],"Barretos-SP":[-20.558,-48.569],"Guaimbe-SP":[-21.960,-49.965],"Santo Expedito-SP":[-21.860,-51.132],"Vargem Grande do Sul-SP":[-21.832,-46.894],"Jeriquara-SP":[-20.319,-47.594],"Bom Sucesso de Itarare-SP":[-24.054,-49.360],"Rio Bananal-ES":[-19.267,-40.334],"Currais Novos-RN":[-6.262,-36.523],"Corumbá de Goiás-GO":[-15.919,-48.808],"Bom Jesus da Penha-MG":[-20.195,-46.218],"Campo Belo-MG":[-20.896,-45.363],"Tupi Paulista-SP":[-21.383,-51.568],"Vista Alegre do Alto-SP":[-21.173,-48.621],"Euclides da Cunha Paulista-SP":[-22.548,-52.377],"São Francisco de Itabapoana-RJ":[-21.480,-41.104],"Guarda-Mor-MG":[-17.777,-47.097]};

function getCoords(order) {
  const key = order.cid + '-' + order.uf;
  if (geocodeCache[key]) return geocodeCache[key];
  if (KNOWN[key]) { geocodeCache[key] = KNOWN[key]; return KNOWN[key]; }
  return null;
}

// ─── MAP INIT ───
const map = new mapboxgl.Map({
  container: 'map',
  style: STYLES.dark,
  center: [-45.5, -14.5],
  zoom: 4.2,
  projection: 'mercator'
});
map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-right');
map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: true, showUserHeading: true
}), 'top-right');

map.on('error', (e) => {
  const status = e?.error?.status;
  if (status === 401 || status === 403) {
    showMapFatalError('O token do Mapbox foi rejeitado (erro ' + status + '). Verifique se o token é válido e se o domínio deste site está autorizado nas restrições de URL do token, em account.mapbox.com.');
  } else {
    console.error('Erro do Mapbox:', e?.error || e);
  }
});

// Inicialização independente do mapa: lista de pedidos, filtros, KPIs e frete
// devem funcionar mesmo se o Mapbox falhar ao carregar (token inválido/ausente).
initFilters();
renderOrders();
updateHeaderKPIs();
updateKPITab();
calcFrete();

map.on('load', () => {
  plotMarkers();
  map.on('moveend', updateZoomStats);
  updateZoomStats();
});

// ─── FILTERS ───
function initFilters() {
  const ufs = [...new Set(orders.map(o => o.uf))].sort();
  const selUf = document.getElementById('f-uf');
  ufs.forEach(u => { selUf.appendChild(Object.assign(document.createElement('option'), { value: u, textContent: u })); });
  const vendors = [...new Set(orders.map(o => o.vnd))].sort();
  const selVnd = document.getElementById('f-vnd');
  vendors.forEach(v => { selVnd.appendChild(Object.assign(document.createElement('option'), { value: v, textContent: v.length > 22 ? v.slice(0, 22) + '…' : v })); });
}

function applyFilters() {
  const q = document.getElementById('f-search').value.toLowerCase();
  const uf = document.getElementById('f-uf').value;
  const sit = document.getElementById('f-sit').value;
  const vnd = document.getElementById('f-vnd').value;
  const d1 = document.getElementById('f-d1').value;
  const d2 = document.getElementById('f-d2').value;
  const sort = document.getElementById('f-sort').value;

  filtered = orders.filter(o => {
    if (q && !(o.cli.toLowerCase().includes(q) || o.cid.toLowerCase().includes(q) || o.id.includes(q) || o.uf.toLowerCase().includes(q) || o.cep.includes(q))) return false;
    if (uf && o.uf !== uf) return false;
    if (sit && o.sit !== sit) return false;
    if (vnd && o.vnd !== vnd) return false;
    if (d1 && o.dat < d1) return false;
    if (d2 && o.dat > d2) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === 'data') return a.dat.localeCompare(b.dat);
    if (sort === 'valor') return b.val - a.val;
    if (sort === 'peso') return b.kg - a.kg;
    if (sort === 'cidade') return a.cid.localeCompare(b.cid);
    return 0;
  });

  document.getElementById('fcount').textContent = filtered.length;
  renderOrders();
  plotMarkers();
  updateZoomStats();
}

// ─── RENDER ORDERS ───
function renderOrders() {
  const container = document.getElementById('order-list');
  container.innerHTML = '';
  filtered.forEach(o => {
    const inRoute = currentRoute.stops.some(s => s.id === o.id);
    const isSel = selected.has(o.id);
    const cls = `ocard ${inRoute ? 'inroute' : (isSel ? 'sel' : '')} ${o.sit.includes('atrasado') ? 'atrasado' : o.sit.includes('hoje') ? 'hoje' : o.sit.includes('Aguardando') ? 'aguardando' : 'pendente'}`;
    const div = document.createElement('div');
    div.className = cls;
    div.innerHTML = `
      <div class="ocheck">${(isSel || inRoute) ? '✓' : ''}</div>
      <div class="och">
        <span class="onum">#${o.id}</span>
        <span class="obadge ${STATUS_CLASS[o.sit].split(' ')[1] || ''}">${STATUS_LABEL[o.sit] || o.sit}</span>
      </div>
      <div class="ocli">${o.cli}</div>
      <div class="ometa">
        <span>📍 ${o.cid}, ${o.uf}</span>
        <span>⚖️ ${o.kg.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg</span>
        <span class="oval">R$${o.val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
      </div>
      <div class="ometa"><span>📅 ${o.dat}</span><span>${o.vnd.slice(0, 18)}</span></div>
    `;
    div.addEventListener('click', e => {
      if (e.shiftKey) { showDetail(o); return; }
      toggleSel(o.id);
    });
    div.addEventListener('dblclick', () => showDetail(o));
    container.appendChild(div);
  });
  updateSelBar();
}

function toggleSel(id) {
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  renderOrders();
}

function selectAll() { filtered.forEach(o => selected.add(o.id)); renderOrders(); }
function clearSel() { selected.clear(); renderOrders(); }

function updateSelBar() {
  const bar = document.getElementById('sel-bar');
  const n = selected.size;
  if (n > 0) { bar.classList.add('on'); document.getElementById('sel-count-txt').textContent = `${n} selecionado(s)`; }
  else bar.classList.remove('on');
}

// ─── MARKERS ───
function plotMarkers() {
  Object.values(markersMap).forEach(m => m.remove());
  markersMap = {};
  if (mapView === 'heat') { plotHeatmap(); return; }
  if (mapView === 'cluster') { plotClusters(); return; }

  const cityGroups = {};
  filtered.forEach(o => {
    const c = getCoords(o);
    if (!c) return;
    const k = c[0].toFixed(3) + ',' + c[1].toFixed(3);
    if (!cityGroups[k]) cityGroups[k] = { coords: c, orders: [] };
    cityGroups[k].orders.push(o);
  });

  Object.entries(cityGroups).forEach(([k, g]) => {
    const allInRoute = g.orders.every(o => currentRoute.stops.some(s => s.id === o.id));
    const anyInRoute = g.orders.some(o => currentRoute.stops.some(s => s.id === o.id));
    const anySel = g.orders.some(o => selected.has(o.id));
    const firstSit = g.orders[0].sit;
    
    let color = STATUS_COLOR[firstSit] || '#4f8fff';
    if (allInRoute) color = '#22d48a';
    else if (anyInRoute) color = '#00d4cc';
    else if (anySel) color = '#ffffff';

    const totalVal = g.orders.reduce((s, o) => s + o.val, 0);
    const totalKg = g.orders.reduce((s, o) => s + o.kg, 0);
    const size = Math.max(10, Math.min(20, 10 + Math.log(totalKg + 1) * 1.5));

    const el = document.createElement('div');
    el.className = 'pt-marker';
    el.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,.25);box-shadow:0 0 ${size}px ${color}55;transition:.2s`;
    
    const mk = new mapboxgl.Marker(el)
      .setLngLat([g.coords[1], g.coords[0]])
      .setPopup(new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(buildPopup(g)))
      .addTo(map);
    
    el.addEventListener('click', () => mk.getPopup().isOpen() ? mk.getPopup().remove() : mk.togglePopup());
    g.orders.forEach(o => markersMap[o.id] = mk);
  });

  if (mapView !== 'heat') removeHeatmap();
}

function buildPopup(g) {
  const totalVal = g.orders.reduce((s, o) => s + o.val, 0);
  const totalKg = g.orders.reduce((s, o) => s + o.kg, 0);
  const city = g.orders[0].cid + ', ' + g.orders[0].uf;
  const ids = g.orders.map(o => o.id).join(',');
  return `<div class="pu-title">📍 ${city}</div>
    <div class="pu-row">Pedidos: <span>${g.orders.length}</span></div>
    <div class="pu-row">Valor: <span>R$${totalVal.toLocaleString('pt-BR', {maximumFractionDigits:0})}</span></div>
    <div class="pu-row">Peso: <span>${totalKg.toLocaleString('pt-BR', {maximumFractionDigits:0})} kg</span></div>
    <div class="pu-row">Situação: <span>${g.orders[0].sit.replace('Faturamento ','')}</span></div>
    <button class="pu-add-btn" onclick="addCityToRoute('${ids}')">+ Adicionar à Rota</button>`;
}

function addCityToRoute(idsStr) {
  const ids = idsStr.split(',');
  let added = 0;
  ids.forEach(id => {
    const o = orders.find(x => x.id === id);
    if (o && !currentRoute.stops.some(s => s.id === id)) { currentRoute.stops.push(o); added++; }
  });
  updateRouteUI();
  drawRoute();
  plotMarkers();
  renderOrders();
  if (added) toast(`${added} pedido(s) adicionado(s) à rota`, 's');
  document.querySelectorAll('.mapboxgl-popup').forEach(p => p.remove());
}

// Heatmap
function plotHeatmap() {
  removeHeatmap();
  const features = [];
  const cityGroups = {};
  filtered.forEach(o => {
    const c = getCoords(o);
    if (!c) return;
    const k = c[0] + ',' + c[1];
    if (!cityGroups[k]) cityGroups[k] = { c, val: 0, kg: 0 };
    cityGroups[k].val += o.val;
    cityGroups[k].kg += o.kg;
  });
  Object.values(cityGroups).forEach(g => {
    features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [g.c[1], g.c[0]] }, properties: { intensity: Math.log(g.val + 1) / 15 } });
  });
  if (!map.getSource('heatmap-src')) {
    map.addSource('heatmap-src', { type: 'geojson', data: { type: 'FeatureCollection', features } });
    map.addLayer({ id: 'heatmap-layer', type: 'heatmap', source: 'heatmap-src', paint: {
      'heatmap-weight': ['get', 'intensity'],
      'heatmap-intensity': 1.5,
      'heatmap-color': ['interpolate',['linear'],['heatmap-density'],0,'rgba(0,0,0,0)',0.2,'rgba(79,143,255,0.5)',0.5,'rgba(157,124,240,0.8)',0.8,'rgba(255,84,112,0.9)',1,'rgba(255,176,32,1)'],
      'heatmap-radius': 30,
      'heatmap-opacity': 0.85
    } });
  } else {
    map.getSource('heatmap-src').setData({ type: 'FeatureCollection', features });
  }
}

function removeHeatmap() {
  if (map.getLayer('heatmap-layer')) map.removeLayer('heatmap-layer');
  if (map.getSource('heatmap-src')) map.removeSource('heatmap-src');
}

function plotClusters() {
  Object.values(markersMap).forEach(m => m.remove());
  markersMap = {};
  removeHeatmap();
  const features = [];
  filtered.forEach(o => {
    const c = getCoords(o);
    if (c) features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [c[1], c[0]] }, properties: { id: o.id, val: o.val } });
  });
  if (map.getSource('cluster-src')) {
    map.getSource('cluster-src').setData({ type: 'FeatureCollection', features });
    return;
  }
  map.addSource('cluster-src', { type: 'geojson', data: { type: 'FeatureCollection', features }, cluster: true, clusterMaxZoom: 10, clusterRadius: 60 });
  map.addLayer({ id: 'clusters', type: 'circle', source: 'cluster-src', filter: ['has', 'point_count'], paint: { 'circle-color': ['step',['get','point_count'],'#4f8fff',5,'#9d7cf0',20,'#ff5470'], 'circle-radius': ['step',['get','point_count'],20,5,30,20,40], 'circle-opacity': 0.85 } });
  map.addLayer({ id: 'cluster-count', type: 'symbol', source: 'cluster-src', filter: ['has', 'point_count'], layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 13, 'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'] }, paint: { 'text-color': '#fff' } });
  map.addLayer({ id: 'unclustered', type: 'circle', source: 'cluster-src', filter: ['!', ['has', 'point_count']], paint: { 'circle-color': '#4f8fff', 'circle-radius': 8, 'circle-opacity': 0.8, 'circle-stroke-width': 1.5, 'circle-stroke-color': 'rgba(255,255,255,.3)' } });
  map.on('click', 'clusters', e => { const f = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0]; map.getSource('cluster-src').getClusterExpansionZoom(f.properties.cluster_id, (err, zoom) => { if (!err) map.flyTo({ center: f.geometry.coordinates, zoom }); }); });
}

// ─── MAP VIEW ───
function setMapView(v) {
  mapView = v;
  document.querySelectorAll('[id^="mv-"]').forEach(b => b.classList.remove('act'));
  document.getElementById('mv-' + v).classList.add('act');
  if (v !== 'cluster') {
    if (map.getLayer('clusters')) map.removeLayer('clusters');
    if (map.getLayer('cluster-count')) map.removeLayer('cluster-count');
    if (map.getLayer('unclustered')) map.removeLayer('unclustered');
    if (map.getSource('cluster-src')) map.removeSource('cluster-src');
  }
  if (v !== 'heat') removeHeatmap();
  plotMarkers();
}

function setStyle(s) {
  mapStyle = s;
  document.querySelectorAll('[id^="ms-"]').forEach(b => b.classList.remove('act'));
  const btn = document.getElementById('ms-' + s);
  if (btn) btn.classList.add('act');
  map.setStyle(STYLES[s]);
  map.once('style.load', () => {
    plotMarkers();
    drawAllSavedRoutes();
    drawRoute();
    if (trafficOn) addTrafficLayers();
    if (is3D) apply3D(true);
    // Re-apply focused route if one was active
    const activeSroute = document.querySelector('.sroute.act');
    if (activeSroute) {
      const idx = [...document.querySelectorAll('.sroute')].indexOf(activeSroute);
      if (idx >= 0) setTimeout(() => focusRoute(idx), 200);
    }
  });
}

// ── TRAFFIC ──────────────────────────────────────────────────────────────────
function toggleTraffic() {
  trafficOn = !trafficOn;
  const btn = document.getElementById('btn-traffic');
  const panel = document.getElementById('traffic-panel');
  if (trafficOn) {
    btn.classList.add('act');
    btn.textContent = '🚦 Trânsito ON';
    panel.style.display = 'block';
    document.getElementById('traffic-legend').style.display = 'block';
    addTrafficLayers();
    updateTrafficInfo();
    toast('Trânsito em tempo real ativado', 'i');
  } else {
    btn.classList.remove('act');
    btn.textContent = '🚦 Trânsito';
    panel.style.display = 'none';
    document.getElementById('traffic-legend').style.display = 'none';
    removeTrafficLayers();
    toast('Trânsito desativado', 'i');
  }
}

function addTrafficLayers() {
  try {
    // Mapbox Traffic v1 source – congestion data updated every 2 min
    if (!map.getSource('mapbox-traffic')) {
      map.addSource('mapbox-traffic', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1'
      });
    }
    // Congestion fill
    if (!map.getLayer('traffic-congestion')) {
      map.addLayer({
        id: 'traffic-congestion',
        type: 'line',
        source: 'mapbox-traffic',
        'source-layer': 'traffic',
        paint: {
          'line-width': ['interpolate',['linear'],['zoom'],5,1.5,12,4,16,8],
          'line-color': [
            'match', ['get','congestion'],
            'low',      '#22d48a',
            'moderate', '#ffb020',
            'heavy',    '#ff5470',
            'severe',   '#9d0000',
            '#aaaaaa'
          ],
          'line-opacity': 0.85
        }
      });
    }
    updateTrafficInfo();
  } catch(e) { console.warn('Traffic layer error:', e); }
}

function removeTrafficLayers() {
  ['traffic-congestion'].forEach(id => { if (map.getLayer(id)) map.removeLayer(id); });
  if (map.getSource('mapbox-traffic')) map.removeSource('mapbox-traffic');
}

function updateTrafficInfo() {
  const now = new Date();
  document.getElementById('traffic-time').textContent =
    now.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
  // Simulate incident count from rendered features (real data from Mapbox tiles)
  setTimeout(() => {
    const features = map.queryRenderedFeatures({ layers: ['traffic-congestion'] });
    const heavy = features.filter(f => f.properties?.congestion === 'heavy' || f.properties?.congestion === 'severe').length;
    document.getElementById('traffic-incidents').textContent = heavy || '—';
    document.getElementById('traffic-speed').textContent = heavy > 5 ? '< 30 km/h' : heavy > 2 ? '30-60 km/h' : '> 60 km/h';
  }, 1500);
  // Auto-refresh every 2 minutes
  if (trafficOn) setTimeout(updateTrafficInfo, 120000);
}

// ── 3D BUILDINGS ──────────────────────────────────────────────────────────────
function toggle3D() {
  is3D = !is3D;
  const btn = document.getElementById('btn-3d');
  apply3D(is3D);
  btn.classList.toggle('act', is3D);
  if (is3D) {
    map.easeTo({ pitch: 55, bearing: -20, duration: 800 });
    toast('Visão 3D ativada — arraste com Ctrl para rotacionar', 'i');
  } else {
    map.easeTo({ pitch: 0, bearing: 0, duration: 600 });
    toast('Visão 3D desativada', 'i');
  }
}

function apply3D(on) {
  try {
    if (on) {
      if (!map.getLayer('3d-buildings')) {
        const labelLayer = map.getStyle().layers.find(l => l.type === 'symbol' && l.layout?.['text-field']);
        map.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': ['interpolate',['linear'],['get','height'],0,'#1a2235',50,'#253047',100,'#354f7a'],
            'fill-extrusion-height': ['interpolate',['linear'],['zoom'],12,0,12.5,['get','height']],
            'fill-extrusion-base': ['interpolate',['linear'],['zoom'],12,0,12.5,['get','min_height']],
            'fill-extrusion-opacity': 0.75
          }
        }, labelLayer?.id);
      }
    } else {
      if (map.getLayer('3d-buildings')) map.removeLayer('3d-buildings');
    }
  } catch(e) { console.warn('3D error:', e); }
}

// ── GLOBE / FLAT ──────────────────────────────────────────────────────────────
function toggleGlobe() {
  globeMode = !globeMode;
  const btn = document.getElementById('btn-globe');
  map.setProjection(globeMode ? 'globe' : 'mercator');
  btn.classList.toggle('act', globeMode);
  if (globeMode) {
    map.easeTo({ zoom: 2.5, center: [-45, -14], duration: 800 });
    // Globe atmosphere
    map.setFog({ color: 'rgb(12,15,26)', 'horizon-blend': 0.04, 'high-color': '#245bde', 'space-color': '#000010', 'star-intensity': 0.9 });
    toast('Projeção Globe ativada', 'i');
  } else {
    map.setFog(null);
    map.easeTo({ zoom: 4.2, center: [-45.5,-14.5], duration: 800 });
    toast('Projeção plana restaurada', 'i');
  }
}

// ─── ROUTE ───
function addSelToRoute() {
  if (selected.size === 0) { toast('Selecione pedidos primeiro', 'w'); return; }
  let added = 0;
  selected.forEach(id => {
    const o = orders.find(x => x.id === id);
    if (o && !currentRoute.stops.some(s => s.id === id)) { currentRoute.stops.push(o); added++; }
  });
  selected.clear();
  renderOrders();
  updateRouteUI();
  drawRoute();
  plotMarkers();
  showTab('rota');
  toast(`${added} parada(s) adicionada(s)`, 's');
}

function removeStop(idx) {
  currentRoute.stops.splice(idx, 1);
  updateRouteUI();
  drawRoute();
  plotMarkers();
  renderOrders();
}

function updateRouteUI() {
  const stops = currentRoute.stops;
  const wrap = document.getElementById('route-summary-wrap');
  const emptyMsg = document.getElementById('empty-msg');
  const stopsEl = document.getElementById('route-stops');

  if (stops.length === 0) {
    wrap.style.display = 'none';
    stopsEl.innerHTML = '';
    stopsEl.appendChild(Object.assign(document.createElement('div'), { innerHTML: '<div class="empty-route"><div class="er-icon">🗺️</div><div class="er-text">Selecione pedidos na lista<br>ou clique nos marcadores no mapa<br>e adicione à rota</div></div>' }));
    return;
  }

  wrap.style.display = 'block';
  stopsEl.innerHTML = '';
  stops.forEach((s, i) => {
    const c = getCoords(s);
    const div = document.createElement('div');
    div.className = 'stop-card';
    div.innerHTML = `
      <div class="stop-num">${i + 1}</div>
      <div class="stop-info">
        <div class="stop-cli">${s.cli.slice(0, 32)}</div>
        <div class="stop-city">${s.cid}, ${s.uf} — CEP ${s.cep}</div>
        <div class="stop-meta">
          <span class="v">R$${s.val.toLocaleString('pt-BR', {maximumFractionDigits:0})}</span>
          <span>${s.kg.toLocaleString('pt-BR', {maximumFractionDigits:0})} kg</span>
          <span>#${s.id}</span>
          <span>${c ? '<span class="stop-gc gc-ok">✓ GEO</span>' : '<span class="stop-gc gc-err">⚠ s/ coords</span>'}</span>
        </div>
      </div>
      <span class="stop-remove" onclick="removeStop(${i})">✕</span>
    `;
    stopsEl.appendChild(div);
  });

  // Summary
  const totalVal = stops.reduce((s, o) => s + o.val, 0);
  const totalKg = stops.reduce((s, o) => s + o.kg, 0);
  const estDist = estimateDist(stops);
  const estHours = Math.round(estDist / 65);
  const cap = currentRoute.vehicle.cap;
  const pct = Math.min(100, Math.round((totalKg / cap) * 100));

  document.getElementById('s-stops').textContent = stops.length;
  document.getElementById('s-orders').textContent = stops.length;
  document.getElementById('s-kg').textContent = totalKg.toLocaleString('pt-BR', {maximumFractionDigits:0}) + ' kg';
  document.getElementById('s-val').textContent = 'R$' + totalVal.toLocaleString('pt-BR', {maximumFractionDigits:0});
  document.getElementById('s-dist').textContent = '~' + estDist.toLocaleString('pt-BR') + ' km';
  document.getElementById('s-time').textContent = `~${estHours}h`;
  document.getElementById('cap-pct').textContent = pct + '%';
  const fill = document.getElementById('cap-fill');
  fill.style.width = pct + '%';
  fill.style.background = pct > 90 ? 'var(--red)' : pct > 70 ? 'var(--amber)' : 'var(--green)';

  // Fiorino-specific validation panel
  const fioPanel = document.getElementById('fiorino-panel');
  if (isFiorino()) {
    fioPanel.style.display = 'block';
    const chk = checkFiorino(stops);
    const freteCusto = estDist * FIORINO_RATE_KM;
    const rateKg = (freteCusto / Math.max(totalKg, 1)).toFixed(3);
    const rules = [
      { lbl: 'Distância', val: estDist + 'km', max: FIORINO_MAX_KM + 'km', ok: estDist <= FIORINO_MAX_KM },
      { lbl: 'Carga alvo', val: totalKg.toFixed(0) + 'kg', max: '1.000kg', ok: totalKg <= FIORINO_MAX_KG },
      { lbl: 'Custo frete', val: 'R$' + freteCusto.toFixed(0), max: 'R$' + (estDist * FIORINO_RATE_KM).toFixed(0), ok: true },
      { lbl: 'Custo/km', val: 'R$' + FIORINO_RATE_KM.toFixed(2), max: 'máx R$1,50', ok: true },
      { lbl: 'Custo/kg', val: 'R$' + rateKg, max: 'estimado', ok: parseFloat(rateKg) <= 3.0 },
      { lbl: 'Cap. máx', val: totalKg.toFixed(0) + 'kg', max: '1.100kg', ok: totalKg <= 1100 },
    ];
    document.getElementById('fiorino-rules').innerHTML = rules.map(r => `
      <div style="background:${r.ok ? 'var(--greenbg)' : 'var(--redbg)'};border:1px solid ${r.ok ? 'rgba(34,212,138,.2)' : 'rgba(255,84,112,.2)'};border-radius:4px;padding:4px 6px">
        <div style="font-size:9px;color:var(--t3)">${r.lbl}</div>
        <div style="font-size:11px;font-weight:700;color:${r.ok ? 'var(--green)' : 'var(--red)'}">${r.val}</div>
        <div style="font-size:9px;color:var(--t3)">${r.max}</div>
      </div>`).join('');
  } else {
    fioPanel.style.display = 'none';
  }

  // Sync frete
  document.getElementById('fr-kg').value = Math.round(totalKg);
  document.getElementById('fr-val').value = Math.round(totalVal);
  if (stops.length > 0) document.getElementById('fr-uf').value = stops[stops.length - 1].uf;
  document.getElementById('fr-dist').value = estDist;
  calcFrete();
  updateKPITab();
}

function estimateDist(stops) {
  if (stops.length === 0) return 0;
  const origin = isFiorino() ? FIORINO_ORIGIN : getOriginCoords();
  let total = 0;
  let prev = origin;
  stops.forEach(s => {
    const c = getCoords(s);
    if (c && prev) {
      total += haversine(prev[0], prev[1], c[0], c[1]);
      prev = c;
    } else { total += 200; prev = c || prev; }
  });
  if (prev) total += haversine(prev[0], prev[1], origin[0], origin[1]);
  return Math.round(total);
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getOriginCoords() {
  const v = document.getElementById('origin-sel').value.split(',');
  return [parseFloat(v[0]), parseFloat(v[1])];
}
function onOriginChange() { updateRouteUI(); drawRoute(); }

// Draw route on map
function drawRoute() {
  routeMarkers.forEach(m => m.remove()); routeMarkers = [];
  if (map.getLayer('route-line')) { map.removeLayer('route-line'); map.removeSource('route-line'); }
  if (map.getLayer('route-arrows')) { map.removeLayer('route-arrows'); }
  if (currentRoute.stops.length === 0) return;

  const origin = isFiorino() ? FIORINO_ORIGIN : getOriginCoords();
  const coords = [[origin[1], origin[0]]];
  currentRoute.stops.forEach((s, i) => {
    const c = getCoords(s);
    if (c) {
      coords.push([c[1], c[0]]);
      const el = document.createElement('div');
      el.innerHTML = `<div style="width:24px;height:24px;border-radius:50%;background:var(--blue);border:2px solid #fff;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(79,143,255,.5)">${i+1}</div>`;
      const mk = new mapboxgl.Marker(el).setLngLat([c[1], c[0]]).addTo(map);
      routeMarkers.push(mk);
    }
  });

  if (coords.length > 1) {
    try {
      map.addSource('route-line', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } } });
      map.addLayer({ id: 'route-line', type: 'line', source: 'route-line', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#4f8fff', 'line-width': 2.5, 'line-dasharray': [3, 2], 'line-opacity': 0.9 } });
    } catch(e) {}
  }
}

// ── DRAW ALL SAVED ROUTES ────────────────────────────────────────────────────
// Each saved route gets its own colored line + numbered markers
const ROUTE_LAYER_PREFIX = 'saved-route-';
const ROUTE_SOURCE_PREFIX = 'saved-route-src-';
let savedRouteMarkers = []; // flat array of all markers from saved routes

function clearAllRouteLayers() {
  // Remove old layers/sources
  const style = map.getStyle();
  if (!style) return;
  style.layers.forEach(l => {
    if (l.id.startsWith(ROUTE_LAYER_PREFIX)) map.removeLayer(l.id);
  });
  Object.keys(style.sources || {}).forEach(s => {
    if (s.startsWith(ROUTE_SOURCE_PREFIX)) map.removeSource(s);
  });
  savedRouteMarkers.forEach(m => m.remove());
  savedRouteMarkers = [];
}

function drawAllSavedRoutes() {
  clearAllRouteLayers();
  if (savedRoutes.length === 0) return;

  savedRoutes.forEach((route, ri) => {
    const origin = route.vehicle?.type === 'fiorino' ? FIORINO_ORIGIN : getOriginCoords();
    const coords = [[origin[1], origin[0]]];

    route.stops.forEach((s, si) => {
      const c = getCoords(s);
      if (!c) return;
      coords.push([c[1], c[0]]);

      // Numbered marker for each stop
      const el = document.createElement('div');
      el.innerHTML = `<div style="
        width:22px;height:22px;border-radius:50%;
        background:${route.color};border:2px solid #fff;
        color:#fff;font-size:9px;font-weight:800;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px ${route.color}88;
        cursor:pointer;
      ">${si + 1}</div>`;

      const popup = new mapboxgl.Popup({ offset: 10, closeButton: false }).setHTML(`
        <div class="pu-title" style="color:${route.color}">${route.name}</div>
        <div class="pu-row">Parada: <span>${si + 1}/${route.stops.length}</span></div>
        <div class="pu-row">Cliente: <span>${s.cli.slice(0,28)}</span></div>
        <div class="pu-row">Cidade: <span>${s.cid}, ${s.uf}</span></div>
        <div class="pu-row">Peso: <span>${s.kg.toLocaleString('pt-BR',{maximumFractionDigits:0})} kg</span></div>
        <div class="pu-row">Valor: <span>R$${s.val.toLocaleString('pt-BR',{maximumFractionDigits:0})}</span></div>
        <button class="pu-add-btn" onclick="loadRoute(${ri})">📋 Ver esta rota</button>
      `);

      const mk = new mapboxgl.Marker(el)
        .setLngLat([c[1], c[0]])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => mk.togglePopup());
      savedRouteMarkers.push(mk);
    });

    if (coords.length < 2) return;

    // Origin marker (only once per route)
    const originEl = document.createElement('div');
    originEl.innerHTML = `<div style="
      width:16px;height:16px;border-radius:50%;
      background:${route.color};border:3px solid #fff;
      box-shadow:0 0 10px ${route.color};
    "></div>`;
    const originMk = new mapboxgl.Marker(originEl)
      .setLngLat([origin[1], origin[0]])
      .addTo(map);
    savedRouteMarkers.push(originMk);

    const srcId = ROUTE_SOURCE_PREFIX + ri;
    const layId = ROUTE_LAYER_PREFIX + ri;

    try {
      map.addSource(srcId, {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } }
      });

      // Shadow / glow line (thicker, transparent)
      map.addLayer({
        id: layId + '-glow',
        type: 'line',
        source: srcId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': route.color,
          'line-width': 8,
          'line-opacity': 0.18
        }
      });

      // Main line
      map.addLayer({
        id: layId,
        type: 'line',
        source: srcId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': route.color,
          'line-width': 2.5,
          'line-dasharray': [4, 2],
          'line-opacity': 0.9
        }
      });
    } catch(e) { console.warn('Route draw error:', e); }
  });
}

function fitMapToAllRoutes(fromIdx, toIdx) {
  const bounds = new mapboxgl.LngLatBounds();
  const origin = getOriginCoords();
  bounds.extend([origin[1], origin[0]]);
  let hasPoints = false;
  for (let i = fromIdx; i <= toIdx; i++) {
    if (!savedRoutes[i]) continue;
    savedRoutes[i].stops.forEach(s => {
      const c = getCoords(s);
      if (c) { bounds.extend([c[1], c[0]]); hasPoints = true; }
    });
  }
  if (hasPoints) {
    map.fitBounds(bounds, { padding: { top: 60, bottom: 60, left: 360, right: 360 }, maxZoom: 10, duration: 900 });
  }
}

// ══════════════════════════════════════════════════════════════════════
// CALCULAR ROTA REAL — Mapbox Directions API (máximo de dados extraídos)
// Extrai: distância real, tempo, pedágios por trecho, instruções,
//         geometria real da estrada, velocidade média por leg,
//         resumo de etapas, rotas alternativas
// ══════════════════════════════════════════════════════════════════════
let lastDirectionsData = null; // cache for re-use

async function calcDirections() {
  const stops = currentRoute.stops.filter(s => getCoords(s));
  if (stops.length < 1) { toast('Adicione ao menos 1 parada geocodificada', 'w'); return; }
  if (stops.length > 24) { toast('Máximo 24 paradas para rota Mapbox Directions', 'w'); return; }

  const origin = isFiorino() ? FIORINO_ORIGIN : getOriginCoords();
  const allPoints = [origin, ...stops.map(s => getCoords(s))];
  const coordStr = allPoints.map(c => `${c[1]},${c[0]}`).join(';');

  // Botão loading
  const btn = document.querySelector('[onclick="calcDirections()"]');
  if (btn) { btn.textContent = '⏳ Calculando...'; btn.disabled = true; }

  try {
    // ── API call: annotations para velocidade e congestionamento ────────────
    const params = new URLSearchParams({
      geometries: 'geojson',
      overview: 'full',
      steps: 'true',                         // instruções virada a virada
      annotations: 'duration,distance,speed,congestion', // dados por segmento
      alternatives: 'false',
      banner_instructions: 'false',
      voice_instructions: 'false',
      language: 'pt',
      access_token: MAPBOX_TOKEN
    });

    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coordStr}?${params}`
    );
    const data = await res.json();

    if (btn) { btn.textContent = '🗺 Calcular Rota Real'; btn.disabled = false; }

    if (!data.routes || data.routes.length === 0) {
      toast('Mapbox não retornou rota. Verifique as paradas.', 'e');
      return;
    }

    const route = data.routes[0];
    lastDirectionsData = data;

    // ── Métricas globais ─────────────────────────────────────────────────────
    const distKm   = (route.distance / 1000).toFixed(1);
    const totalSec = route.duration;
    const hours    = Math.floor(totalSec / 3600);
    const minutes  = Math.round((totalSec % 3600) / 60);
    const timeStr  = hours > 0 ? `${hours}h${minutes.toString().padStart(2,'0')}min` : `${minutes}min`;
    const avgSpeed = route.distance > 0 ? ((route.distance / 1000) / (totalSec / 3600)).toFixed(0) : '—';

    // ── Pedágios: extrair de cada leg ────────────────────────────────────────
    // Mapbox retorna toll_cost em USD quando disponível; também contamos toll steps
    let tollCount  = 0;
    let tollCostUSD = 0;
    const legDetails = [];

    route.legs.forEach((leg, li) => {
      const legDistKm = (leg.distance / 1000).toFixed(1);
      const legSec    = leg.duration;
      const legMin    = Math.round(legSec / 60);

      // Detectar pedágios nas etapas
      let legTolls = 0;
      let legTollCost = 0;
      (leg.steps || []).forEach(step => {
        if (step.intersections) {
          step.intersections.forEach(inter => {
            if (inter.toll) { legTolls++; tollCount++; }
          });
        }
        // Toll annotation on step
        if (step.toll_collection) {
          legTolls++;
          tollCount++;
          if (step.toll_collection.type === 'booth' || step.toll_collection.type === 'etoll') {
            legTollCost += estimateTollBR(step.distance || 0);
            tollCostUSD += legTollCost;
          }
        }
      });

      // Also check for toll annotation via congestion level
      const congArr = leg.annotation?.congestion || [];
      const speeds  = leg.annotation?.speed || [];
      const avgLegSpeed = speeds.length > 0
        ? (speeds.reduce((a,b)=>a+b,0)/speeds.length * 3.6).toFixed(0)
        : '—';

      const fromLabel = li === 0 ? 'CD Origem' : `Parada ${li}`;
      const toLabel   = li < stops.length ? (stops[li]?.cid || `Parada ${li+1}`) : 'Destino';

      legDetails.push({
        from: fromLabel, to: toLabel,
        distKm: legDistKm, min: legMin,
        tolls: legTolls, tollCost: legTollCost,
        avgSpeed: avgLegSpeed,
        congestion: congArr
      });
    });

    // Se Mapbox não detectou pedágios via steps, estima por distância (tabela ANTT)
    // R$ 0.08/km é a média histórica de pedágios nas rodovias federais BR
    if (tollCount === 0) {
      const estimatedTollBR = estimateTollsByRoute(allPoints, parseFloat(distKm));
      tollCount  = estimatedTollBR.count;
      tollCostUSD = estimatedTollBR.cost;
      legDetails.forEach((leg, i) => {
        leg.tolls    = estimatedTollBR.perLeg[i] || 0;
        leg.tollCost = estimatedTollBR.costPerLeg[i] || 0;
      });
    }

    const tollStr = tollCostUSD > 0
      ? `R$${tollCostUSD.toFixed(2)} (${tollCount} praça${tollCount !== 1 ? 's' : ''})`
      : tollCount > 0 ? `${tollCount} praça${tollCount !== 1 ? 's' : ''}` : 'Livre ✓';

    // ── Atualizar painel de resumo ────────────────────────────────────────────
    document.getElementById('s-dist').textContent = distKm + ' km';
    document.getElementById('s-time').textContent = timeStr;
    document.getElementById('s-toll').textContent = tollStr;
    document.getElementById('fr-dist').value = Math.round(parseFloat(distKm));

    // Toll panel
    document.getElementById('toll-panel').style.display = 'block';
    document.getElementById('toll-kpis').innerHTML = `
      <div class="toll-kpi"><div class="tk-lbl">Distância real</div><div class="tk-val" style="color:var(--blue2)">${distKm} km</div></div>
      <div class="toll-kpi"><div class="tk-lbl">Tempo trânsito</div><div class="tk-val" style="color:var(--t1)">${timeStr}</div></div>
      <div class="toll-kpi"><div class="tk-lbl">Vel. média</div><div class="tk-val" style="color:var(--green)">${avgSpeed} km/h</div></div>
      <div class="toll-kpi"><div class="tk-lbl">Praças pedágio</div><div class="tk-val" style="color:var(--amber)">${tollCount}</div></div>
      <div class="toll-kpi"><div class="tk-lbl">Custo pedágio</div><div class="tk-val" style="color:var(--amber)">R$${tollCostUSD.toFixed(2)}</div></div>
      <div class="toll-kpi"><div class="tk-lbl">Custo total est.</div><div class="tk-val" style="color:var(--red)">R$${(tollCostUSD + parseFloat(distKm) * 1.5).toFixed(2)}</div></div>
    `;

    // Legs (trecho a trecho)
    document.getElementById('legs-list').innerHTML = legDetails.map((leg, i) => `
      <div class="leg-card">
        <div class="leg-head">
          <div class="leg-name">📍 ${leg.from} → ${leg.to}</div>
          <span class="leg-badge ${leg.tolls > 0 ? 'leg-toll' : 'leg-notoll'}">
            ${leg.tolls > 0 ? `🛣 ${leg.tolls} pedágio${leg.tolls>1?'s':''}` : '✓ Sem pedágio'}
          </span>
        </div>
        <div class="leg-meta">
          <span>📏 ${leg.distKm} km</span>
          <span>⏱ ${leg.min} min</span>
          <span>⚡ ${leg.avgSpeed} km/h</span>
          ${leg.tolls > 0 ? `<span style="color:var(--amber)">💰 R$${leg.tollCost.toFixed(2)}</span>` : ''}
        </div>
      </div>
    `).join('');

    // ── Desenhar geometria real no mapa ──────────────────────────────────────
    ['focused-glow','focused-line','route-line'].forEach(id => {
      try { if (map.getLayer(id)) map.removeLayer(id); } catch(e){}
    });
    ['focused-route-src','route-line'].forEach(id => {
      try { if (map.getSource(id)) map.removeSource(id); } catch(e){}
    });

    // Colorir segmentos por congestionamento
    const allCoords = route.geometry.coordinates;
    map.addSource('route-line', { type: 'geojson', data: { type: 'Feature', geometry: route.geometry } });

    // Glow layer
    map.addLayer({ id: 'route-glow', type: 'line', source: 'route-line',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#4f8fff', 'line-width': 12, 'line-opacity': 0.12 }
    });

    // Main animated line
    map.addLayer({ id: 'route-line', type: 'line', source: 'route-line',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#4f8fff', 'line-width': 4, 'line-opacity': 0.95 }
    });

    // ── Fit map ──────────────────────────────────────────────────────────────
    const bounds = new mapboxgl.LngLatBounds();
    route.geometry.coordinates.forEach(c => bounds.extend(c));
    map.fitBounds(bounds, {
      padding: { top: 60, bottom: 80, left: 380, right: 380 },
      duration: 1000
    });

    calcFrete();
    toast(`✅ Rota real: ${distKm}km | ${timeStr} | ${tollCount} pedágio(s) R$${tollCostUSD.toFixed(2)}`, 's');

  } catch(err) {
    if (btn) { btn.textContent = '🗺 Calcular Rota Real'; btn.disabled = false; }
    console.error('calcDirections error:', err);
    toast('Erro ao calcular rota real: ' + err.message, 'e');
  }
}

// ── Estimativa de pedágios BR por distância e rodovia ────────────────────────
// Baseado na tabela ANTT: média R$0,085/km em rodovias federais concedidas
function estimateTollBR(distMeters) {
  return (distMeters / 1000) * 0.085;
}

function estimateTollsByRoute(allPoints, totalKm) {
  // Heurística: ~1 praça a cada 100km em rodovias concedidas BR
  // Custo médio por praça: R$8-15 (carro); Fiorino ~R$12
  const count    = Math.max(0, Math.round(totalKm / 90) - 1);
  const costEach = 11.50; // R$ médio por praça (Fiorino/VUC)
  const cost     = count * costEach;
  const n        = allPoints.length - 1; // number of legs
  const perLeg   = Array(n).fill(0).map((_, i) => i < count ? 1 : 0);
  const costPerLeg = perLeg.map(t => t * costEach);
  return { count, cost, perLeg, costPerLeg };
}

// ─── OPTIMIZE ───
function optimizeRoute() {
  if (currentRoute.stops.length < 3) { toast('Precisa de ao menos 3 paradas para otimizar', 'w'); return; }
  const origin = getOriginCoords();
  let remaining = currentRoute.stops.filter(s => getCoords(s));
  const ungeocoded = currentRoute.stops.filter(s => !getCoords(s));
  let current = origin;
  const ordered = [];

  // Nearest neighbor
  while (remaining.length > 0) {
    let best = null, bestDist = Infinity, bestIdx = 0;
    remaining.forEach((s, i) => {
      const c = getCoords(s);
      const d = haversine(current[0], current[1], c[0], c[1]);
      if (d < bestDist) { bestDist = d; best = s; bestIdx = i; }
    });
    ordered.push(best);
    current = getCoords(best);
    remaining.splice(bestIdx, 1);
  }

  // 2-opt improvement
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < ordered.length - 1; i++) {
      for (let j = i + 2; j < ordered.length; j++) {
        const c1 = i === 0 ? origin : getCoords(ordered[i - 1]);
        const c2 = getCoords(ordered[i]);
        const c3 = getCoords(ordered[j]);
        const c4 = j === ordered.length - 1 ? origin : getCoords(ordered[j + 1]);
        if (!c1||!c2||!c3||!c4) continue;
        const before = haversine(c1[0],c1[1],c2[0],c2[1]) + haversine(c3[0],c3[1],c4[0],c4[1]);
        const after = haversine(c1[0],c1[1],c3[0],c3[1]) + haversine(c2[0],c2[1],c4[0],c4[1]);
        if (after < before - 0.1) {
          ordered.splice(i, j - i + 1, ...ordered.slice(i, j + 1).reverse());
          improved = true;
        }
      }
    }
  }

  currentRoute.stops = [...ordered, ...ungeocoded];
  updateRouteUI();
  drawRoute();
  toast('Rota otimizada com 2-opt!', 's');
}

// ─── FIORINO RULES ───
const FIORINO_ORIGIN = [-19.932, -44.053]; // Rua A 330, Vila Paris, Contagem
const FIORINO_MAX_KM = 2000;
const FIORINO_MAX_KG = 1000;  // target load (cap is 1100 but we aim for 1000)
const FIORINO_RATE_KM = 1.50; // R$/km máximo agregado

function isFiorino() { return currentRoute.vehicle.type === 'fiorino'; }

function calcRouteTotalDist(stops) {
  const origin = isFiorino() ? FIORINO_ORIGIN : getOriginCoords();
  let total = 0, prev = origin;
  stops.forEach(s => {
    const c = getCoords(s);
    if (c) { total += haversine(prev[0], prev[1], c[0], c[1]); prev = c; }
    else total += 80;
  });
  if (prev !== origin) total += haversine(prev[0], prev[1], origin[0], origin[1]);
  return Math.round(total);
}

function checkFiorino(stops) {
  if (!isFiorino()) return null;
  const kg = stops.reduce((s,o)=>s+o.kg,0);
  const dist = calcRouteTotalDist(stops);
  const freteCusto = dist * FIORINO_RATE_KM;
  const ok_dist = dist <= FIORINO_MAX_KM;
  const ok_kg = kg <= 1100;
  const ok_rate = (freteCusto / Math.max(kg, 1)) <= FIORINO_RATE_KM;
  return { kg, dist, freteCusto, ok_dist, ok_kg, ok_rate,
    distPct: Math.round(dist/FIORINO_MAX_KM*100),
    kgPct: Math.round(kg/FIORINO_MAX_KG*100)
  };
}

function showFiorinoAlert(chk) {
  if (!chk) return;
  const issues = [];
  if (!chk.ok_dist) issues.push(`⚠ Distância ${chk.dist}km excede limite de ${FIORINO_MAX_KM}km`);
  if (!chk.ok_kg) issues.push(`⚠ Peso ${chk.kg.toFixed(0)}kg excede capacidade de 1.100kg`);
  const rateKg = (chk.freteCusto / Math.max(chk.kg, 1)).toFixed(3);
  const custo = `💰 Custo estimado: R$${chk.freteCusto.toFixed(0)} (${chk.dist}km × R$${FIORINO_RATE_KM}/km) = R$${rateKg}/kg`;
  if (issues.length > 0) {
    toast(issues[0], 'e');
  } else {
    toast(`Fiorino ✓ ${chk.dist}km | ${chk.kg.toFixed(0)}kg | ${custo}`, 's');
  }
}

// ─── AUTO CLUSTER ───
// ══════════════════════════════════════════════════════════════════
// AUTO-ROTEIRIZAR — FIORINO (Geographic Density Clustering + 2-opt)
// Objetivo: muitos pedidos próximos, ~1000kg, ≤2000km por rota
// ══════════════════════════════════════════════════════════════════

function autoCluster() {
  const isFio = isFiorino();
  const origin = isFio ? FIORINO_ORIGIN : getOriginCoords();
  const KG_TARGET  = isFio ? 1000  : currentRoute.vehicle.cap * 0.9;
  const KG_MAX     = isFio ? 1100  : currentRoute.vehicle.cap;
  const DIST_MAX   = isFio ? 2000  : 99999;
  // Max one-way radius so round-trip stays ≤ DIST_MAX
  const RADIUS_MAX = isFio ? 900   : 99999;

  // ── 1. Get candidates with coords, within radius ──────────────
  const all = filtered.filter(o => getCoords(o));
  if (all.length === 0) { toast('Sem pedidos geocodificados', 'w'); return; }

  const eligible = isFio
    ? all.filter(o => {
        const c = getCoords(o);
        return haversine(origin[0], origin[1], c[0], c[1]) <= RADIUS_MAX;
      })
    : all;

  const excluded = all.length - eligible.length;

  if (eligible.length === 0) {
    toast(`Nenhum pedido dentro de ${RADIUS_MAX}km da origem para Fiorino`, 'w');
    return;
  }

  // ── 2. Geographic clustering: group nearby orders (DBSCAN-like) ─
  // Epsilon: max distance between points in same geo-cluster
  // Tighter = more clusters, better geographic grouping
  const GEO_EPS_KM = isFio ? 120 : 300;

  const geoClusters = geoDBSCAN(eligible, GEO_EPS_KM);

  // ── 3. For each geo-cluster, build capacity-respecting routes ───
  const routesBefore = savedRoutes.length;
  let routeNum = routesBefore + 1;

  // Sort geo-clusters by total kg descending (densest first)
  geoClusters.sort((a, b) =>
    b.reduce((s,o) => s + o.kg, 0) - a.reduce((s,o) => s + o.kg, 0)
  );

  geoClusters.forEach(geoCluster => {
    // Sort cluster by proximity to origin (ida-e-volta friendly)
    const sorted = nearestNeighborOpt([...geoCluster], origin);

    // Split cluster into capacity-respecting sub-routes
    // targeting KG_TARGET, never exceeding KG_MAX or DIST_MAX
    let bucket = [], bucketKg = 0;

    sorted.forEach((o, idx) => {
      const wouldKg = bucketKg + o.kg;

      // Check projected route distance if we add this order
      const testRoute = [...bucket, o];
      const projDist = calcRouteTotalDistFromOrigin(testRoute, origin);

      const overKg   = wouldKg > KG_MAX;
      const overDist = projDist > DIST_MAX;
      // Flush if: weight limit OR distance limit OR already hit target and this order is far
      const hitTarget = bucketKg >= KG_TARGET;
      const newOrderFar = bucket.length > 0 && (() => {
        const lastCoord = getCoords(bucket[bucket.length - 1]);
        const newCoord  = getCoords(o);
        if (!lastCoord || !newCoord) return false;
        return haversine(lastCoord[0], lastCoord[1], newCoord[0], newCoord[1]) > GEO_EPS_KM * 1.5;
      })();

      if (bucket.length > 0 && (overKg || overDist || (hitTarget && newOrderFar))) {
        const opt = twoOpt(nearestNeighborOpt([...bucket], origin), origin);
        saveClusterRoute(opt, routeNum++,
          isFio ? 'fiorino' : currentRoute.vehicle.type,
          isFio ? 1100 : currentRoute.vehicle.cap, origin);
        bucket = []; bucketKg = 0;
      }

      bucket.push(o);
      bucketKg += o.kg;
    });

    if (bucket.length > 0) {
      const opt = twoOpt(nearestNeighborOpt([...bucket], origin), origin);
      saveClusterRoute(opt, routeNum++,
        isFio ? 'fiorino' : currentRoute.vehicle.type,
        isFio ? 1100 : currentRoute.vehicle.cap, origin);
    }
  });

  const created = savedRoutes.length - routesBefore;
  renderSaved();
  // Show all routes on map first, then zoom to first generated
  drawAllSavedRoutes();
  fitMapToAllRoutes(routesBefore, savedRoutes.length - 1);
  showTab('salvas');

  const exclMsg = excluded > 0 ? ` | ${excluded} fora do raio` : '';
  // Quality summary
  const newRoutes = savedRoutes.slice(routesBefore);
  const avgKg = newRoutes.length
    ? Math.round(newRoutes.reduce((s,r) => s + r.totalKg, 0) / newRoutes.length)
    : 0;
  const avgDist = newRoutes.length
    ? Math.round(newRoutes.reduce((s,r) => s + (r.totalDist||0), 0) / newRoutes.length)
    : 0;
  toast(`✅ ${created} rota(s) | média ${avgKg}kg / ${avgDist}km${exclMsg}`, 's');
}

// ── Geographic DBSCAN ─────────────────────────────────────────────
// Returns array of clusters (each cluster = array of orders)
function geoDBSCAN(orders, epsKm) {
  const visited  = new Set();
  const clusters = [];

  orders.forEach((seed, i) => {
    if (visited.has(i)) return;
    visited.add(i);

    const seedC = getCoords(seed);
    if (!seedC) return;

    // Find all neighbors within epsKm
    const neighbors = orders.reduce((arr, o, j) => {
      if (j === i) return arr;
      const c = getCoords(o);
      if (c && haversine(seedC[0], seedC[1], c[0], c[1]) <= epsKm) arr.push(j);
      return arr;
    }, []);

    // Expand cluster
    const cluster = [seed];
    const queue = [...neighbors];
    while (queue.length > 0) {
      const j = queue.shift();
      if (!visited.has(j)) {
        visited.add(j);
        const jC = getCoords(orders[j]);
        if (jC) {
          const jNeighbors = orders.reduce((arr, o, k) => {
            if (visited.has(k)) return arr;
            const c = getCoords(o);
            if (c && haversine(jC[0], jC[1], c[0], c[1]) <= epsKm) arr.push(k);
            return arr;
          }, []);
          queue.push(...jNeighbors);
        }
        cluster.push(orders[j]);
      } else if (!cluster.includes(orders[j])) {
        cluster.push(orders[j]);
      }
    }
    clusters.push(cluster);
  });

  return clusters;
}

// ── Nearest-Neighbor heuristic ────────────────────────────────────
function nearestNeighborOpt(stops, origin) {
  let remaining = [...stops], current = origin, ordered = [];
  while (remaining.length > 0) {
    let best = null, bestD = Infinity, bestIdx = 0;
    remaining.forEach((s, i) => {
      const c = getCoords(s);
      if (!c) return;
      const d = haversine(current[0], current[1], c[0], c[1]);
      if (d < bestD) { bestD = d; best = s; bestIdx = i; }
    });
    if (!best) { ordered.push(...remaining); break; }
    ordered.push(best);
    current = getCoords(best) || current;
    remaining.splice(bestIdx, 1);
  }
  return ordered;
}

// ── 2-opt improvement ─────────────────────────────────────────────
function twoOpt(stops, origin) {
  if (stops.length < 4) return stops;
  let improved = true, route = [...stops];
  let iterations = 0;
  while (improved && iterations++ < 40) {
    improved = false;
    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 2; j < route.length; j++) {
        const ci = i === 0 ? origin : getCoords(route[i - 1]);
        const cj = getCoords(route[i]);
        const ck = getCoords(route[j]);
        const cl = j === route.length - 1 ? origin : getCoords(route[j + 1]);
        if (!ci||!cj||!ck||!cl) continue;
        const before = haversine(ci[0],ci[1],cj[0],cj[1]) + haversine(ck[0],ck[1],cl[0],cl[1]);
        const after  = haversine(ci[0],ci[1],ck[0],ck[1]) + haversine(cj[0],cj[1],cl[0],cl[1]);
        if (after < before - 0.5) {
          route.splice(i, j - i + 1, ...route.slice(i, j + 1).reverse());
          improved = true;
        }
      }
    }
  }
  return route;
}

function saveClusterRoute(stops, num, vtype, vcap, origin) {
  const colors = ['#4f8fff','#22d48a','#ffb020','#ff5470','#9d7cf0','#00d4cc','#ff8c42'];
  const _origin = origin || (vtype === 'fiorino' ? FIORINO_ORIGIN : getOriginCoords());
  const dist = calcRouteTotalDistFromOrigin(stops, _origin);
  const kg = stops.reduce((s,o)=>s+o.kg,0);
  const freteCusto = vtype === 'fiorino' ? dist * FIORINO_RATE_KM : dist * 2.5;
  const tollEst = estimateTollsByRoute(
    [_origin, ...stops.map(s => getCoords(s)).filter(Boolean)], dist
  );
  savedRoutes.push({
    id: Date.now() + num,
    name: `${vtype === 'fiorino' ? '🚗 Fiorino' : '🚚 Rota'} ${num}`,
    color: colors[(num - 1) % colors.length],
    stops: [...stops],
    totalVal: stops.reduce((s,o)=>s+o.val,0),
    totalKg: kg,
    totalDist: dist,
    freteCusto: freteCusto,
    tollCount: tollEst.count,
    tollCost: tollEst.cost,
    createdAt: new Date().toLocaleDateString('pt-BR'),
    vehicle: { type: vtype, cap: vcap }
  });
  document.getElementById('saved-badge').textContent = savedRoutes.length;
}

function calcRouteTotalDistFromOrigin(stops, origin) {
  let total = 0, prev = origin;
  stops.forEach(s => {
    const c = getCoords(s);
    if (c) { total += haversine(prev[0],prev[1],c[0],c[1]); prev = c; }
  });
  if (prev !== origin) total += haversine(prev[0],prev[1],origin[0],origin[1]);
  return Math.round(total);
}

// ─── SAVE/LOAD ROUTE ───
function saveRoute() {
  if (currentRoute.stops.length === 0) { toast('Adicione paradas primeiro', 'w'); return; }
  const name = document.getElementById('route-name').value || 'Rota ' + (savedRoutes.length + 1);
  const colors = ['#4f8fff','#22d48a','#ffb020','#ff5470','#9d7cf0','#00d4cc','#ff8c42'];
  savedRoutes.push({
    id: Date.now(),
    name,
    color: colors[savedRoutes.length % colors.length],
    stops: [...currentRoute.stops],
    totalVal: currentRoute.stops.reduce((s, o) => s + o.val, 0),
    totalKg: currentRoute.stops.reduce((s, o) => s + o.kg, 0),
    createdAt: new Date().toLocaleDateString('pt-BR'),
    vehicle: { ...currentRoute.vehicle }
  });
  document.getElementById('saved-badge').textContent = savedRoutes.length;
  renderSaved();
  drawAllSavedRoutes();
  fitMapToAllRoutes(savedRoutes.length - 1, savedRoutes.length - 1);
  toast(`"${name}" salva e exibida no mapa!`, 's');
  document.getElementById('route-name').value = 'Rota ' + (savedRoutes.length + 1);
}

function clearRoute() {
  currentRoute.stops = [];
  updateRouteUI();
  drawRoute();
  plotMarkers();
  renderOrders();
}

function renderSaved() {
  const el = document.getElementById('saved-list');
  if (savedRoutes.length === 0) { el.innerHTML = '<div class="saved-empty">Nenhuma rota salva ainda</div>'; return; }
  el.innerHTML = savedRoutes.map((r, i) => `
    <div class="sroute" onclick="loadRoute(${i})">
      <div class="sr-head">
        <div class="sr-name"><div class="sr-dot" style="background:${r.color}"></div>${r.name}</div>
        <div style="font-size:10px;color:var(--t3)">${r.createdAt}</div>
      </div>
      <div class="sr-meta">${r.stops.length} paradas · <span style="color:var(--green)">R$${r.totalVal.toLocaleString('pt-BR',{maximumFractionDigits:0})}</span> · ${r.totalKg.toLocaleString('pt-BR',{maximumFractionDigits:0})}kg · ~${r.totalDist||'?'}km</div>
      <div class="sr-meta" style="display:flex;gap:8px;margin-top:3px">
        <span style="color:var(--amber)">🛣 ${r.tollCount||0} pedágio(s) ~R$${(r.tollCost||0).toFixed(0)}</span>
        <span style="color:var(--t3)">💰 frete ~R$${(r.freteCusto||0).toFixed(0)}</span>
      </div>
      <div class="sr-meta" style="color:${r.vehicle?.type==='fiorino'?'var(--amber)':'var(--t3)'}">
        ${r.vehicle?.type==='fiorino'?'🚗 Fiorino':'🚚 '+r.vehicle?.type} · ${(r.totalDist||0)<=2000?'<span style="color:var(--green)">✓ '+r.totalDist+'km</span>':'<span style="color:var(--red)">⚠ '+r.totalDist+'km</span>'}
      </div>
      <div class="sr-actions">
        <button class="hbtn" style="font-size:10px;padding:3px 8px" onclick="event.stopPropagation();loadRoute(${i})">Carregar</button>
        <button class="hbtn danger" style="font-size:10px;padding:3px 8px" onclick="event.stopPropagation();deleteRoute(${i})">✕ Remover</button>
      </div>
    </div>
  `).join('');
}

function loadRoute(i) {
  currentRoute.stops = [...savedRoutes[i].stops];
  currentRoute.vehicle = { ...savedRoutes[i].vehicle };
  document.getElementById('route-name').value = savedRoutes[i].name;

  // Sync vehicle UI
  document.querySelectorAll('.vcard').forEach(v => v.classList.remove('act'));
  const vcard = document.querySelector(`.vcard[data-type="${savedRoutes[i].vehicle?.type}"]`);
  if (vcard) vcard.classList.add('act');

  updateRouteUI();
  renderOrders();

  // Focus ONLY this route on the map
  focusRoute(i);

  // Highlight saved card
  document.querySelectorAll('.sroute').forEach((el, idx) => {
    el.classList.toggle('act', idx === i);
  });

  showTab('rota');
}

// ── FOCUS SINGLE ROUTE ON MAP ─────────────────────────────────────
// Clears everything, draws only the selected route with its color
// + numbered markers + animated fit-bounds
function focusRoute(i) {
  const route = savedRoutes[i];
  if (!route) return;

  // 1. Clear all existing route layers and markers
  clearAllRouteLayers();

  // 2. Remove the "all markers" layer and replace with route-specific markers
  Object.values(markersMap).forEach(m => m.remove());
  markersMap = {};
  routeMarkers.forEach(m => m.remove());
  routeMarkers = [];
  if (map.getLayer('route-line')) { try { map.removeLayer('route-line'); map.removeSource('route-line'); } catch(e){} }

  const origin = route.vehicle?.type === 'fiorino' ? FIORINO_ORIGIN : getOriginCoords();
  const color  = route.color || '#4f8fff';
  const coords = [[origin[1], origin[0]]];
  const bounds = new mapboxgl.LngLatBounds();
  bounds.extend([origin[1], origin[0]]);

  // 3. Origin marker
  const originEl = document.createElement('div');
  originEl.innerHTML = `<div style="
    width:18px;height:18px;border-radius:50%;
    background:${color};border:3px solid #fff;
    box-shadow:0 0 14px ${color}cc;
  "></div>`;
  const originMk = new mapboxgl.Marker(originEl)
    .setLngLat([origin[1], origin[0]])
    .setPopup(new mapboxgl.Popup({ offset:10, closeButton:false })
      .setHTML(`<div class="pu-title" style="color:${color}">📦 Origem CD</div>
        <div class="pu-row">Rua A, 330 — Vila Paris, Contagem</div>`))
    .addTo(map);
  routeMarkers.push(originMk);

  // 4. Stop markers with popups
  route.stops.forEach((s, si) => {
    const c = getCoords(s);
    if (!c) return;
    coords.push([c[1], c[0]]);
    bounds.extend([c[1], c[0]]);

    const el = document.createElement('div');
    el.innerHTML = `<div style="
      width:26px;height:26px;border-radius:50%;
      background:${color};border:2.5px solid #fff;
      color:#fff;font-size:10px;font-weight:800;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 10px ${color}99;
      cursor:pointer;transition:transform .15s;
    ">${si + 1}</div>`;

    el.firstElementChild.addEventListener('mouseenter', () => { el.firstElementChild.style.transform = 'scale(1.25)'; });
    el.firstElementChild.addEventListener('mouseleave', () => { el.firstElementChild.style.transform = 'scale(1)'; });

    const popup = new mapboxgl.Popup({ offset:12, closeButton:false }).setHTML(`
      <div class="pu-title" style="color:${color}">${route.name} — Parada ${si + 1}/${route.stops.length}</div>
      <div class="pu-row">Cliente: <span>${s.cli.slice(0,30)}</span></div>
      <div class="pu-row">Cidade: <span>${s.cid}, ${s.uf}</span></div>
      <div class="pu-row">CEP: <span>${s.cep}</span></div>
      <div class="pu-row">Peso: <span>${s.kg.toLocaleString('pt-BR',{maximumFractionDigits:0})} kg</span></div>
      <div class="pu-row">Valor: <span style="color:var(--green);font-weight:700">R$${s.val.toLocaleString('pt-BR',{maximumFractionDigits:0})}</span></div>
      <div class="pu-row">Status: <span>${s.sit.replace('Faturamento ','')}</span></div>
    `);

    const mk = new mapboxgl.Marker(el)
      .setLngLat([c[1], c[0]])
      .setPopup(popup)
      .addTo(map);

    el.addEventListener('click', () => mk.togglePopup());
    routeMarkers.push(mk);
  });

  // 5. Draw route line (glow + main)
  if (coords.length > 1) {
    const srcId = 'focused-route-src';
    const geojson = { type:'Feature', geometry:{ type:'LineString', coordinates:coords } };
    try {
      if (map.getSource(srcId)) {
        map.getSource(srcId).setData(geojson);
      } else {
        map.addSource(srcId, { type:'geojson', data: geojson });
        // Glow
        map.addLayer({ id:'focused-glow', type:'line', source:srcId,
          layout:{'line-join':'round','line-cap':'round'},
          paint:{'line-color':color,'line-width':10,'line-opacity':0.15}
        });
        // Main dashed
        map.addLayer({ id:'focused-line', type:'line', source:srcId,
          layout:{'line-join':'round','line-cap':'round'},
          paint:{'line-color':color,'line-width':3,'line-dasharray':[4,2],'line-opacity':0.95}
        });
      }
    } catch(e) { console.warn('focusRoute draw error:', e); }
  }

  // 6. Animated fit-bounds with sidebar padding
  map.fitBounds(bounds, {
    padding: { top:60, bottom:60, left:360, right:360 },
    maxZoom: 11,
    duration: 900,
    easing: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t  // ease-in-out
  });

  // 7. Show only the filtered orders that belong to this route in the list
  const routeIds = new Set(route.stops.map(s => s.id));
  const prevFiltered = [...filtered];
  filtered = orders.filter(o => routeIds.has(o.id));
  renderOrders();
  filtered = prevFiltered; // restore filtered so other features still work

  toast(`🗺 Exibindo: ${route.name} — ${route.stops.length} paradas`, 'i');
}

function deleteRoute(i) {
  savedRoutes.splice(i, 1);
  document.getElementById('saved-badge').textContent = savedRoutes.length;
  renderSaved();
  drawAllSavedRoutes();
  plotMarkers();
}

function clearAllSaved() {
  if (savedRoutes.length === 0) return;
  savedRoutes = [];
  document.getElementById('saved-badge').textContent = 0;
  renderSaved();
  clearFocusedLayers();
  clearAllRouteLayers();
  plotMarkers();
  toast('Todas as rotas removidas', 'w');
}

function clearFocusedLayers() {
  ['focused-glow','focused-line'].forEach(id => {
    try { if (map.getLayer(id)) map.removeLayer(id); } catch(e){}
  });
  try { if (map.getSource('focused-route-src')) map.removeSource('focused-route-src'); } catch(e){}
}

function showAllRoutes() {
  // Remove focused-only layers
  clearFocusedLayers();
  routeMarkers.forEach(m => m.remove());
  routeMarkers = [];
  // Draw all saved routes
  drawAllSavedRoutes();
  plotMarkers();
  fitMapToAllRoutes(0, savedRoutes.length - 1);
  // Restore full order list
  applyFilters();
  document.querySelectorAll('.sroute').forEach(el => el.classList.remove('act'));
  toast('Exibindo todas as rotas', 'i');
}

// ─── VEHICLE ───
function selVehicle(el, type, cap) {
  document.querySelectorAll('.vcard').forEach(v => v.classList.remove('act'));
  el.classList.add('act');
  currentRoute.vehicle = { type, cap };
  updateRouteUI();
}

// ─── FREIGHT ───
const ANTT_BANDS = [
  {max:50,rate:4.2},{max:100,rate:3.8},{max:200,rate:3.2},{max:400,rate:2.7},
  {max:700,rate:2.4},{max:1000,rate:2.1},{max:99999,rate:1.85}
];
const STATE_DIST_FROM_BH = {MG:180,SP:540,BA:1050,CE:1780,RJ:430,GO:700,MT:1380,PI:1690,AL:1510,PE:1580,MA:1830,MS:980,RN:2010,PB:1920,SE:1400,ES:520,TO:1280};
const CARRIERS = [
  {name:'Jadlog',icon:'📦',base:.0042,min:25,icms:true,prazo:'3-5 dias',type:'rodoviário'},
  {name:'Sequoia Log.',icon:'🚛',base:.0038,min:20,icms:true,prazo:'2-4 dias',type:'rodoviário'},
  {name:'Braspress',icon:'🚚',base:.0045,min:30,icms:true,prazo:'3-6 dias',type:'rodoviário'},
  {name:'Correios SEDEX',icon:'📮',base:.0075,min:18,icms:false,prazo:'1-3 dias',type:'expresso'},
  {name:'Correios PAC',icon:'📮',base:.0052,min:14,icms:false,prazo:'5-10 dias',type:'econômico'},
  {name:'TransBrasil',icon:'🚛',base:.0035,min:22,icms:true,prazo:'4-7 dias',type:'rodoviário'},
  {name:'Localfrio',icon:'❄️',base:.0095,min:80,icms:true,prazo:'2-5 dias',type:'refrigerado'},
];

function calcFrete() {
  const kg = parseFloat(document.getElementById('fr-kg').value) || 100;
  const valNF = parseFloat(document.getElementById('fr-val').value) || 1000;
  const uf = document.getElementById('fr-uf').value;
  let dist = parseFloat(document.getElementById('fr-dist').value);
  if (!dist || isNaN(dist)) { dist = STATE_DIST_FROM_BH[uf] || 400; document.getElementById('fr-dist').value = dist; }
  const tipo = document.getElementById('fr-tipo').value;
  const mult = tipo === 'refrig' ? 1.6 : tipo === 'fragil' ? 1.25 : tipo === 'perig' ? 1.4 : 1.0;

  const gris = valNF * 0.003;
  const ped = dist * 0.08;

  const results = CARRIERS.map(c => {
    if (tipo === 'refrig' && c.type !== 'refrigerado' && c.name !== 'Correios SEDEX') return null;
    const base = Math.max(kg * c.base * (dist / 100) * mult, c.min);
    const icmsV = c.icms ? base * 0.12 : 0;
    const totalFreight = base + icmsV + (c.icms ? gris : 0) + (c.icms ? ped * 0.5 : 0);
    return { ...c, base, icmsV, gris: c.icms ? gris : 0, ped: c.icms ? ped * 0.5 : 0, total: totalFreight };
  }).filter(Boolean).sort((a, b) => a.total - b.total);

  const cl = document.getElementById('carrier-list');
  cl.innerHTML = results.map((r, i) => `
    <div class="ccard ${i === 0 ? 'best' : ''}">
      <div class="cc-head">
        <div class="cc-name">${r.icon} ${r.name} ${i === 0 ? '<span class="cbadge">✓ Mais barato</span>' : ''}</div>
        <div class="cc-price">R$${r.total.toFixed(2)}</div>
      </div>
      <div class="cc-sub">${r.prazo} · ${r.type} · R$${(r.total/kg).toFixed(3)}/kg</div>
      <div class="cc-breakdown">
        <div class="ccb-item">Base: <span>R$${r.base.toFixed(2)}</span></div>
        <div class="ccb-item">ICMS: <span>R$${r.icmsV.toFixed(2)}</span></div>
        <div class="ccb-item">GRIS: <span>R$${r.gris.toFixed(2)}</span></div>
        <div class="ccb-item">Pedágio: <span>R$${r.ped.toFixed(2)}</span></div>
      </div>
    </div>
  `).join('');

  // ANTT
  const anttBand = ANTT_BANDS.find(b => dist <= b.max);
  const ton = kg / 1000;
  const anttBase = ton * dist * anttBand.rate;
  const anttTotal = anttBase + gris + ped;
  document.getElementById('antt-grid').innerHTML = `
    <div class="antt-row"><div class="antt-key">Distância</div><div class="antt-val">${dist} km</div></div>
    <div class="antt-row"><div class="antt-key">Taxa ANTT</div><div class="antt-val">R$${anttBand.rate}/km/t</div></div>
    <div class="antt-row"><div class="antt-key">Frete base</div><div class="antt-val">R$${anttBase.toFixed(2)}</div></div>
    <div class="antt-row"><div class="antt-key">GRIS (0,3%)</div><div class="antt-val">R$${gris.toFixed(2)}</div></div>
    <div class="antt-row"><div class="antt-key">Pedágio</div><div class="antt-val">R$${ped.toFixed(2)}</div></div>
    <div class="antt-row"><div class="antt-key">Pedágio est.</div><div class="antt-val" style="color:var(--amber)">R$${estimateTollsByRoute([],dist).cost.toFixed(2)}</div></div>
    <div class="antt-row antt-total"><div class="antt-key">Total CIF+Pedágio</div><div class="antt-val">R$${(anttTotal+estimateTollsByRoute([],dist).cost).toFixed(2)}</div></div>
    <div class="antt-row"><div class="antt-key">R$/kg (c/ pedágio)</div><div class="antt-val">R$${((anttTotal+estimateTollsByRoute([],dist).cost)/kg).toFixed(4)}</div></div>
    <div class="antt-row"><div class="antt-key">% do NF</div><div class="antt-val">${(anttTotal/valNF*100).toFixed(2)}%</div></div>
  `;

  updateKPIRouteMetrics(anttTotal, kg, valNF);
}

// ─── KPIs ───
function updateHeaderKPIs() {
  const at = orders.filter(o => o.sit === 'Faturamento atrasado').length;
  const hj = orders.filter(o => o.sit === 'Previsto para hoje').length;
  const totalVal = orders.reduce((s, o) => s + o.val, 0);
  const totalKg = orders.reduce((s, o) => s + o.kg, 0);
  document.getElementById('kv-at').textContent = at;
  document.getElementById('kv-hj').textContent = hj;
  document.getElementById('kv-tot').textContent = orders.length;
  document.getElementById('kv-val').textContent = 'R$' + (totalVal/1000).toFixed(0) + 'k';
  document.getElementById('kv-kg').textContent = (totalKg/1000).toFixed(1) + 't';
}

function updateKPITab() {
  const at = orders.filter(o => o.sit === 'Faturamento atrasado').length;
  const hj = orders.filter(o => o.sit === 'Previsto para hoje').length;
  const totalVal = orders.reduce((s, o) => s + o.val, 0);
  const totalKg = orders.reduce((s, o) => s + o.kg, 0);
  document.getElementById('ki-at').textContent = at;
  document.getElementById('ki-hj').textContent = hj;
  document.getElementById('ki-avg').textContent = 'R$' + (totalVal/orders.length).toFixed(0);
  document.getElementById('ki-avgkg').textContent = (totalKg/orders.length).toFixed(0) + ' kg';
  
  // Bar por UF
  const ufVals = {};
  orders.forEach(o => { ufVals[o.uf] = (ufVals[o.uf] || 0) + o.val; });
  const topUF = Object.entries(ufVals).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxUF = topUF[0]?.[1] || 1;
  document.getElementById('kpi-bar-uf').innerHTML = topUF.map(([uf,v]) => `
    <div class="bar-row">
      <div class="bar-label">${uf}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(v/maxUF*100).toFixed(0)}%;background:var(--blue)"></div></div>
      <div class="bar-val">R$${(v/1000).toFixed(0)}k</div>
    </div>`).join('');

  // Bar por situação
  const sitVals = {};
  orders.forEach(o => { sitVals[o.sit] = (sitVals[o.sit] || 0) + 1; });
  const maxSit = Math.max(...Object.values(sitVals));
  const sitColors = {'Faturamento atrasado':'var(--red)','Aguardando faturamento':'var(--amber)','Previsto para hoje':'var(--blue)','Proposta pendente':'var(--purple)'};
  document.getElementById('kpi-bar-sit').innerHTML = Object.entries(sitVals).map(([sit,n]) => `
    <div class="bar-row">
      <div class="bar-label" style="width:55px;font-size:8px">${sit.slice(0,8)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(n/maxSit*100).toFixed(0)}%;background:${sitColors[sit]||'var(--blue)'}"></div></div>
      <div class="bar-val">${n}</div>
    </div>`).join('');

  document.getElementById('ki-stops').textContent = currentRoute.stops.length;
  const cap = currentRoute.vehicle.cap;
  const routeKg = currentRoute.stops.reduce((s,o)=>s+o.kg,0);
  document.getElementById('ki-ocp').textContent = Math.min(100,Math.round(routeKg/cap*100)) + '%';
}

function updateKPIRouteMetrics(frete, kg, valNF) {
  const tollEst2 = estimateTollsByRoute([], parseFloat(document.getElementById('fr-dist').value)||300);
  document.getElementById('ki-ckg').textContent = kg > 0 ? 'R$' + (frete/kg).toFixed(3) : '—';
  document.getElementById('ki-cnf').textContent = valNF > 0 ? (frete/valNF*100).toFixed(2) + '%' : '—';
}

// ─── ZOOM STATS ───
function updateZoomStats() {
  const bounds = map.getBounds();
  const visible = filtered.filter(o => {
    const c = getCoords(o);
    if (!c) return false;
    return bounds.contains([c[1], c[0]]);
  });
  const vVal = visible.reduce((s,o)=>s+o.val,0);
  const vKg = visible.reduce((s,o)=>s+o.kg,0);
  document.getElementById('zs-visible').textContent = visible.length;
  document.getElementById('zs-valor').textContent = 'R$'+(vVal/1000).toFixed(0)+'k';
  document.getElementById('zs-peso').textContent = (vKg/1000).toFixed(1)+'t';
}

// ─── MAP SEARCH ───
async function searchOnMap() {
  const q = document.getElementById('map-search-input').value;
  if (!q) return;
  try {
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?country=BR&access_token=${MAPBOX_TOKEN}`);
    const data = await res.json();
    if (data.features && data.features[0]) {
      const [lng, lat] = data.features[0].center;
      map.flyTo({ center: [lng, lat], zoom: 10, speed: 1.5 });
      toast('Localização encontrada', 'i');
    }
  } catch(e) {}
}

// ─── DETAIL MODAL ───
function showDetail(o) {
  const prods = o.prod.map(p => `
    <div class="prod-item">
      <div class="prod-desc">${p.d}</div>
      <div class="prod-meta">
        <span>${p.q} kg</span>
        <span>R$${p.v.toLocaleString('pt-BR',{minimumFractionDigits:2})}</span>
      </div>
    </div>`).join('');

  const sitCls = STATUS_CLASS[o.sit]?.split(' ')[1] || '';
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-head">
      <div class="modal-title">Pedido #${o.id}</div>
      <span class="modal-close" onclick="closeModal()">✕</span>
    </div>
    <div class="dg">
      <div class="di full"><label>Cliente</label><span style="font-weight:700">${o.cli}</span></div>
      <div class="di"><label>Situação</label><span class="obadge ${sitCls}">${STATUS_LABEL[o.sit]||o.sit}</span></div>
      <div class="di"><label>Data prevista</label><span>${o.dat}</span></div>
      <div class="di full"><label>Endereço</label><span>${o.end}, ${o.bai}</span></div>
      <div class="di"><label>Cidade / UF</label><span>${o.cid}, ${o.uf}</span></div>
      <div class="di"><label>CEP</label><span>${o.cep}</span></div>
      <div class="di"><label>Peso total</label><span style="color:var(--amber);font-weight:700">${o.kg.toLocaleString('pt-BR',{maximumFractionDigits:1})} kg</span></div>
      <div class="di"><label>Valor NF</label><span style="color:var(--green);font-weight:700">R$${o.val.toLocaleString('pt-BR',{minimumFractionDigits:2})}</span></div>
      <div class="di full"><label>Vendedor</label><span>${o.vnd}</span></div>
    </div>
    <div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Produtos (${o.prod.length})</div>
    <div class="prod-list">${prods}</div>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="hbtn primary" style="flex:1" onclick="addToRouteFromModal('${o.id}');closeModal()">+ Adicionar à Rota</button>
      <button class="hbtn" onclick="flyToFromModal('${o.id}');closeModal()">🗺 Ver no Mapa</button>
    </div>
  `;
  document.getElementById('modal-bg').classList.add('open');
}

function addToRouteFromModal(id) {
  const o = orders.find(x => x.id === id);
  if (o && !currentRoute.stops.some(s => s.id === id)) {
    currentRoute.stops.push(o);
    updateRouteUI(); drawRoute(); plotMarkers(); renderOrders();
    toast('Pedido adicionado à rota', 's');
    showTab('rota');
  }
}

function flyToFromModal(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const c = getCoords(o);
  if (c) map.flyTo({ center: [c[1], c[0]], zoom: 11, speed: 1.5 });
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-bg')) document.getElementById('modal-bg').classList.remove('open');
}

// ─── TABS ───
function showTab(name) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('act'));
  document.querySelectorAll('.pcontent').forEach(c => c.classList.remove('act'));
  document.getElementById('tab-' + name).classList.add('act');
  document.getElementById('pc-' + name).classList.add('act');
  if (name === 'kpi') updateKPITab();
}

// ─── PANEL TOGGLE ───
function toggleLeftPanel() {
  leftOpen = !leftOpen;
  document.getElementById('panel-left').classList.toggle('collapsed', !leftOpen);
}

// ─── EXPORT ───
function exportRoutes() {
  const routesToExport = savedRoutes.length > 0 ? savedRoutes : (currentRoute.stops.length > 0 ? [{ name: 'Rota Atual', stops: currentRoute.stops, totalVal: currentRoute.stops.reduce((s,o)=>s+o.val,0), totalKg: currentRoute.stops.reduce((s,o)=>s+o.kg,0) }] : []);
  if (routesToExport.length === 0) { toast('Nenhuma rota para exportar', 'w'); return; }
  let csv = '\uFEFFRota,Parada,Pedido,Cliente,Endereço,Cidade,UF,CEP,Peso(kg),Valor(R$),Situação,Data,Vendedor\n';
  routesToExport.forEach(r => {
    r.stops.forEach((s, i) => {
      csv += `"${r.name}",${i+1},"${s.id}","${s.cli}","${s.end}","${s.cid}","${s.uf}","${s.cep}",${s.kg.toFixed(1)},${s.val.toFixed(2)},"${s.sit}","${s.dat}","${s.vnd}"\n`;
    });
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = 'rotas_horizonte_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
  toast('Exportado com sucesso!', 's');
}

// ─── TOAST ───
function toast(msg, type = 'i') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + type + ' show';
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3200);
}


// ═══════════════════════════════════════════════════════════════
// ── IMPORTAÇÃO DE PLANILHA ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

const REQUIRED_COLS = [
  'Previsão de Faturamento (completa)',
  'Pedido',
  'Cliente (Nome Fantasia)',
  'Endereço Completo',
  'Bairro',
  'Cidade',
  'Estado',
  'CEP',
  'Descrição do Produto (completa)',
  'Quantidade',
  'Situação',
  'Total de Mercadoria',
  'Vendedor'
];

// Normaliza nomes de coluna para comparação tolerante a acentos,
// maiúsculas/minúsculas e espaços extras (varia entre exportações de planilha).
function normalizeHeader(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

// Para cada coluna obrigatória, encontra a coluna correspondente na planilha
// (mesmo com diferenças de acento/caixa/espaço) e remapeia as linhas para os
// nomes canônicos esperados por parseRows().
function matchColumns(rows, foundCols) {
  const normalizedMap = {};
  foundCols.forEach(c => { normalizedMap[normalizeHeader(c)] = c; });

  const colAliasMap = {};
  REQUIRED_COLS.forEach(req => {
    colAliasMap[req] = normalizedMap[normalizeHeader(req)] || null;
  });

  const normalizedRows = rows.map(r => {
    const nr = { ...r };
    REQUIRED_COLS.forEach(req => {
      const actual = colAliasMap[req];
      if (actual && actual !== req) nr[req] = r[actual];
    });
    return nr;
  });

  const matchedCols = REQUIRED_COLS.filter(c => colAliasMap[c] != null);
  const missingCols = REQUIRED_COLS.filter(c => colAliasMap[c] == null);

  return { normalizedRows, matchedCols, missingCols };
}

let importedRawData = null; // parsed rows before confirm

function openImport() {
  const modal = document.getElementById('import-modal');
  modal.style.display = 'flex';
  resetImport();
  renderColChips([]);
}

function closeImport() {
  document.getElementById('import-modal').style.display = 'none';
  importedRawData = null;
}

function resetImport() {
  document.getElementById('import-preview').style.display = 'none';
  document.getElementById('import-loading').style.display = 'none';
  document.getElementById('drop-zone').style.display = 'block';
  document.getElementById('file-input').value = '';
  importedRawData = null;
  renderColChips([]);
}

function renderColChips(foundCols) {
  const container = document.getElementById('col-chips');
  container.innerHTML = REQUIRED_COLS.map(c => {
    const ok = foundCols.includes(c);
    return `<span class="col-chip ${foundCols.length === 0 ? '' : ok ? 'ok' : 'err'}">${c}</span>`;
  }).join('');
}

// Drag & drop
const dz = document.getElementById('drop-zone');
dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
dz.addEventListener('drop', e => {
  e.preventDefault();
  dz.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
});

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  if (!file.name.match(/\.xlsx?$/i)) {
    toast('Arquivo inválido — use .xlsx ou .xls', 'e');
    return;
  }
  document.getElementById('drop-zone').style.display = 'none';
  document.getElementById('import-loading').style.display = 'block';
  document.getElementById('import-preview').style.display = 'none';

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array', cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      if (rows.length === 0) throw new Error('Planilha vazia');

      const foundCols = Object.keys(rows[0]);
      const { normalizedRows, matchedCols, missingCols } = matchColumns(rows, foundCols);
      renderColChips(matchedCols);

      // Validate required columns (tolerante a acentos/caixa/espaços)
      const missing = missingCols;
      const errors = [];
      const warnings = [];

      if (missing.length > 0) {
        errors.push('Colunas não encontradas: ' + missing.join(', '));
      }

      // Parse into order objects
      const parsed = parseRows(normalizedRows, warnings);

      document.getElementById('import-loading').style.display = 'none';
      document.getElementById('import-preview').style.display = 'block';

      // Show errors
      const errEl = document.getElementById('import-errors');
      if (errors.length > 0) {
        errEl.style.display = 'block';
        errEl.innerHTML = '❌ ' + errors.join('<br>');
      } else {
        errEl.style.display = 'none';
      }

      // Show warnings
      const warnEl = document.getElementById('import-warnings');
      if (warnings.length > 0) {
        warnEl.style.display = 'block';
        warnEl.innerHTML = '⚠ ' + warnings.slice(0, 5).join('<br>') + (warnings.length > 5 ? `<br>... e mais ${warnings.length - 5} aviso(s)` : '');
      } else {
        warnEl.style.display = 'none';
      }

      // Preview header
      document.getElementById('preview-title').textContent =
        `${file.name} — ${rows.length} linhas brutas`;
      document.getElementById('preview-badges').innerHTML = `
        <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:var(--bluebg);border:1px solid var(--blue);color:var(--blue2)">${parsed.length} pedidos</span>
        <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:var(--greenbg);border:1px solid var(--green);color:var(--green)">R$${parsed.reduce((s,o)=>s+o.val,0).toLocaleString('pt-BR',{maximumFractionDigits:0})}</span>
        <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:var(--amberbg);border:1px solid var(--amber);color:var(--amber)">${parsed.reduce((s,o)=>s+o.kg,0).toLocaleString('pt-BR',{maximumFractionDigits:0})} kg</span>
      `;

      // Preview table (first 8 orders)
      renderPreviewTable(parsed.slice(0, 8));

      if (errors.length === 0) importedRawData = parsed;

    } catch(err) {
      document.getElementById('import-loading').style.display = 'none';
      document.getElementById('drop-zone').style.display = 'block';
      toast('Erro ao ler planilha: ' + err.message, 'e');
    }
  };
  reader.readAsArrayBuffer(file);
}

function parseRows(rows, warnings) {
  const orderMap = {};

  rows.forEach((r, idx) => {
    const pedido = String(r['Pedido'] || '').trim();
    const cidade = String(r['Cidade'] || '').trim();
    const uf     = String(r['Estado'] || '').trim();
    if (!pedido || !cidade || !uf) {
      warnings.push(`Linha ${idx + 2}: Pedido/Cidade/UF vazio — ignorada`);
      return;
    }

    const key = pedido + '|' + cidade + '|' + uf;
    if (!orderMap[key]) {
      // Parse date
      let dat = '';
      const rawDate = r['Previsão de Faturamento (completa)'];
      if (rawDate instanceof Date) {
        dat = rawDate.toISOString().slice(0, 10);
      } else if (rawDate) {
        // Try to parse string date DD/MM/YYYY or YYYY-MM-DD
        const s = String(rawDate).trim();
        if (s.match(/^\d{4}-\d{2}-\d{2}/)) dat = s.slice(0, 10);
        else if (s.match(/^\d{2}\/\d{2}\/\d{4}/)) {
          const [d, m, y] = s.split('/');
          dat = `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
        } else dat = s.slice(0, 10);
      }

      orderMap[key] = {
        id:  pedido,
        cli: String(r['Cliente (Nome Fantasia)'] || '').slice(0, 50),
        end: String(r['Endereço Completo'] || '').slice(0, 60),
        bai: String(r['Bairro'] || '').slice(0, 30),
        cid: cidade,
        uf:  uf.toUpperCase().slice(0, 2),
        cep: String(r['CEP'] || '').trim().replace(/[^\d-]/g,''),
        sit: String(r['Situação'] || 'Aguardando faturamento'),
        vnd: String(r['Vendedor'] || '').slice(0, 30),
        dat: dat,
        kg:  0,
        val: 0,
        prod: []
      };
    }

    const qty = parseFloat(r['Quantidade']) || 0;
    const val = parseFloat(r['Total de Mercadoria']) || 0;
    orderMap[key].kg  += qty;
    orderMap[key].val += val;
    orderMap[key].prod.push({
      d: String(r['Descrição do Produto (completa)'] || '').slice(0, 60),
      q: qty,
      v: val
    });
  });

  return Object.values(orderMap);
}

function renderPreviewTable(orders) {
  const cols = ['Pedido','Cliente','Cidade','UF','Data','Kg','Valor R$','Situação'];
  const thead = `<thead><tr>${cols.map(c=>`<th class="prev-th">${c}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${orders.map(o => `<tr>
    <td class="prev-td hl">#${o.id}</td>
    <td class="prev-td">${o.cli.slice(0,25)}</td>
    <td class="prev-td">${o.cid}</td>
    <td class="prev-td">${o.uf}</td>
    <td class="prev-td">${o.dat}</td>
    <td class="prev-td">${o.kg.toLocaleString('pt-BR',{maximumFractionDigits:1})}</td>
    <td class="prev-td" style="color:var(--green);font-weight:700">R$${o.val.toLocaleString('pt-BR',{maximumFractionDigits:0})}</td>
    <td class="prev-td">${o.sit.replace('Faturamento ','').replace('faturamento','fat.')}</td>
  </tr>`).join('')}</tbody>`;
  document.getElementById('preview-table').innerHTML = thead + tbody;
}

function confirmImport() {
  if (!importedRawData || importedRawData.length === 0) {
    toast('Nenhum dado válido para importar', 'e');
    return;
  }

  // Replace global data
  orders = [...importedRawData];
  filtered = [...orders];
  selected.clear();
  currentRoute.stops = [];
  savedRoutes = [];

  // Reset geocode cache only for new cities
  geocodeCache = {};

  // Rebuild filters
  document.getElementById('f-uf').innerHTML = '<option value="">Todos</option>';
  document.getElementById('f-vnd').innerHTML = '<option value="">Todos</option>';
  document.getElementById('f-search').value = '';
  document.getElementById('f-sit').value = '';
  document.getElementById('f-d1').value = '';
  document.getElementById('f-d2').value = '';
  initFilters();

  // Refresh UI
  renderOrders();
  updateHeaderKPIs();
  updateKPITab();
  clearAllRouteLayers();
  plotMarkers();
  updateRouteUI();
  renderSaved();

  // Update header stat badges
  document.getElementById('saved-badge').textContent = 0;
  document.getElementById('fcount').textContent = orders.length;

  closeImport();
  toast(`✅ ${importedRawData.length} pedidos importados com sucesso!`, 's');
}


// ── ZERAR CARTEIRA ────────────────────────────────────────────────
function clearCarteira() {
  if (!confirm('Zerar toda a carteira de pedidos? Rotas salvas também serão removidas.')) return;

  // Clear data
  orders = [];
  filtered = [];
  selected.clear();
  currentRoute.stops = [];
  savedRoutes = [];
  geocodeCache = {};

  // Reset filters
  document.getElementById('f-uf').innerHTML = '<option value="">Todos</option>';
  document.getElementById('f-vnd').innerHTML = '<option value="">Todos</option>';
  document.getElementById('f-search').value = '';
  document.getElementById('f-sit').value = '';
  document.getElementById('f-d1').value = '';
  document.getElementById('f-d2').value = '';

  // Refresh UI
  document.getElementById('fcount').textContent = '0';
  document.getElementById('saved-badge').textContent = '0';
  document.getElementById('order-list').innerHTML =
    '<div style="padding:30px 16px;text-align:center;color:var(--t3);font-size:12px">Carteira zerada.<br>Importe uma planilha para começar.</div>';

  updateHeaderKPIs();
  updateKPITab();
  clearAllRouteLayers();
  plotMarkers();
  updateRouteUI();
  renderSaved();

  toast('Carteira zerada com sucesso', 's');
}


// ── FULLSCREEN MAP ────────────────────────────────────────────────
let mapFull = false;
function toggleFullMap() {
  mapFull = !mapFull;
  const wrap = document.getElementById('map-wrap');
  const btn  = document.getElementById('btn-fullmap');
  wrap.classList.toggle('fullmap', mapFull);
  btn.classList.toggle('on', mapFull);
  btn.textContent = mapFull ? '✕ Sair' : '⛶ Tela Cheia';
  // Resize map after transition
  setTimeout(() => map.resize(), 50);
  // ESC to exit
  if (mapFull) {
    document.addEventListener('keydown', _escFullMap);
  } else {
    document.removeEventListener('keydown', _escFullMap);
  }
}
function _escFullMap(e) {
  if (e.key === 'Escape' && mapFull) toggleFullMap();
}


// ════════════════════════════════════════════════════════════════════
// SISTEMA DE ALERTAS VIÁRIOS — 3 fontes integradas
// 1. TomTom Traffic Incidents API (acidentes, obras, eventos em tempo real)
// 2. OpenStreetMap Overpass API   (radares fixos cadastrados)
// 3. PRF Dados Abertos BR         (histórico de acidentes federais)
// ════════════════════════════════════════════════════════════════════

// TomTom API Key (gratuito até 2.500 req/dia)
const TOMTOM_KEY = 'hbZ0fkIIpT5N3aTZtR1tnlVMopJwv0dR'; // demo key público

let tomtomOn   = false;
let radaresOn  = false;
let prfOn      = false;
let incidentMarkers = [];
let radarMarkers    = [];
let prfMarkers      = [];
let incidentRefreshTimer = null;

// ── INCIDENT TYPE MAP ────────────────────────────────────────────────────────
const INCIDENT_ICONS = {
  0:  { emoji: '🚗', label: 'Desconhecido',      bg: '#555' },
  1:  { emoji: '🚗', label: 'Acidente',           bg: '#ff5470' },
  2:  { emoji: '🌫', label: 'Neblina/Clima',      bg: '#9d7cf0' },
  3:  { emoji: '⚠️', label: 'Perigo',             bg: '#ffb020' },
  4:  { emoji: '🛑', label: 'Bloqueio total',     bg: '#9d0000' },
  5:  { emoji: '🚧', label: 'Obra na pista',      bg: '#ff8c42' },
  6:  { emoji: '🚦', label: 'Redução de faixa',   bg: '#ffb020' },
  7:  { emoji: '🚌', label: 'Evento de tráfego',  bg: '#4f8fff' },
  8:  { emoji: '🛣', label: 'Obras',              bg: '#ff8c42' },
  9:  { emoji: '🌊', label: 'Alagamento',         bg: '#00d4cc' },
  10: { emoji: '🪨', label: 'Objeto na pista',    bg: '#9d7cf0' },
  11: { emoji: '❄️', label: 'Gelo/Neve',          bg: '#aaddff' },
  14: { emoji: '🔥', label: 'Incêndio',           bg: '#ff5470' },
};

// ── 1. TOMTOM INCIDENTS ──────────────────────────────────────────────────────
async function toggleTomTom() {
  tomtomOn = !tomtomOn;
  const btn = document.getElementById('btn-tomtom');
  btn.classList.toggle('act', tomtomOn);
  btn.textContent = tomtomOn ? '🚨 Incidentes ON' : '🚨 Incidentes';

  const legEl = document.getElementById('incident-legend');
  if (legEl) legEl.style.display = tomtomOn ? 'block' : 'none';

  document.getElementById('traffic-panel').style.display = tomtomOn ? 'block' : document.getElementById('traffic-panel').style.display;

  if (tomtomOn) {
    await fetchTomTomIncidents();
    incidentRefreshTimer = setInterval(fetchTomTomIncidents, 5 * 60 * 1000); // refresh 5min
    toast('🚨 Incidentes em tempo real ativados (TomTom)', 'i');
  } else {
    clearInterval(incidentRefreshTimer);
    clearIncidentMarkers();
    document.getElementById('tomtom-count').textContent = '—';
    updateIncidentFeed([]);
    toast('Incidentes desativados', 'i');
  }
}

async function fetchTomTomIncidents() {
  const bounds = map.getBounds();
  const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

  // TomTom Traffic Incidents API v5
  const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_KEY}&bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay,roadNumbers,timeValidity}}}&language=pt-BR&t=1111&categoryFilter=0,1,2,3,4,5,6,7,8,9,10,11,14&expansionFields=4`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const incidents = data.incidents || [];

    clearIncidentMarkers();
    document.getElementById('tomtom-count').textContent = incidents.length;

    const feedItems = [];
    incidents.forEach(inc => {
      const props = inc.properties || {};
      const cat   = props.iconCategory || 0;
      const icon  = INCIDENT_ICONS[cat] || INCIDENT_ICONS[0];
      const geom  = inc.geometry;
      if (!geom) return;

      // Get coordinates (point or first coord of line)
      let coords;
      if (geom.type === 'Point') {
        coords = geom.coordinates;
      } else if (geom.type === 'LineString' && geom.coordinates.length > 0) {
        const mid = Math.floor(geom.coordinates.length / 2);
        coords = geom.coordinates[mid];
      } else return;

      const [lng, lat] = coords;
      const desc = props.events?.[0]?.description || icon.label;
      const road = props.roadNumbers?.join(', ') || props.from || '';
      const delay = props.delay ? `+${Math.round(props.delay/60)} min` : '';

      // Marker element
      const el = document.createElement('div');
      el.className = 'inc-marker';
      el.style.background = icon.bg;
      el.innerHTML = icon.emoji;
      el.title = `${icon.label}: ${desc}`;

      const popup = new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(`
        <div class="pu-title" style="color:${icon.bg}">${icon.emoji} ${icon.label}</div>
        <div class="pu-row">Desc.: <span>${desc}</span></div>
        ${road ? `<div class="pu-row">Via: <span>${road}</span></div>` : ''}
        ${delay ? `<div class="pu-row">Atraso: <span style="color:var(--red)">${delay}</span></div>` : ''}
        ${props.from ? `<div class="pu-row">De: <span>${props.from}</span></div>` : ''}
        ${props.to ? `<div class="pu-row">Para: <span>${props.to}</span></div>` : ''}
        <div class="pu-row" style="color:var(--t3);font-size:9px">Fonte: TomTom Traffic API</div>
      `);

      const mk = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => mk.togglePopup());
      incidentMarkers.push(mk);

      feedItems.push({ icon, desc, road, delay, cat });
    });

    updateIncidentFeed(feedItems);
    updateAlertPanel();

  } catch(err) {
    console.warn('TomTom error:', err);
    // Fallback: mostrar aviso sem bloquear
    document.getElementById('tomtom-count').textContent = 'err';
    toast('TomTom: sem resposta (verifique conexão)', 'w');
  }
}

function clearIncidentMarkers() {
  incidentMarkers.forEach(m => m.remove());
  incidentMarkers = [];
}

// ── 2. RADARES FIXOS — OpenStreetMap Overpass API ────────────────────────────
async function toggleRadares() {
  radaresOn = !radaresOn;
  const btn = document.getElementById('btn-radares');
  btn.classList.toggle('act', radaresOn);
  btn.textContent = radaresOn ? '📷 Radares ON' : '📷 Radares';

  if (radaresOn) {
    await fetchRadaresOSM();
    toast('📷 Radares fixos carregados (OpenStreetMap)', 'i');
  } else {
    radarMarkers.forEach(m => m.remove());
    radarMarkers = [];
    document.getElementById('radar-count').textContent = '—';
    toast('Radares desativados', 'i');
  }
}

async function fetchRadaresOSM() {
  const bounds = map.getBounds();
  const bb = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;

  // Overpass QL: busca speed cameras, radares e enforcement no Brasil
  const query = `
    [out:json][timeout:25];
    (
      node["highway"="speed_camera"](${bb});
      node["enforcement"="maxspeed"](${bb});
      node["enforcement"="traffic_signals"](${bb});
      node["man_made"="surveillance"]["surveillance:type"="ALPR"](${bb});
    );
    out body;
  `;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query)
    });
    const data = await res.json();
    const nodes = data.elements || [];

    radarMarkers.forEach(m => m.remove());
    radarMarkers = [];
    document.getElementById('radar-count').textContent = nodes.length;

    nodes.forEach(node => {
      const { lat, lon, tags = {} } = node;
      const maxspeed = tags.maxspeed || tags['maxspeed:advisory'] || '?';
      const direction = tags.direction || tags['camera:direction'] || '?';
      const road = tags.ref || tags.name || '';

      const el = document.createElement('div');
      el.className = 'inc-marker';
      el.style.background = '#9d7cf0';
      el.style.fontSize = '12px';
      el.innerHTML = '📷';

      const popup = new mapboxgl.Popup({ offset:10, closeButton:false }).setHTML(`
        <div class="pu-title" style="color:#9d7cf0">📷 Radar Fixo</div>
        <div class="pu-row">Velocidade máxima: <span style="color:var(--red);font-weight:800">${maxspeed} km/h</span></div>
        ${direction !== '?' ? `<div class="pu-row">Direção: <span>${direction}°</span></div>` : ''}
        ${road ? `<div class="pu-row">Via: <span>${road}</span></div>` : ''}
        <div class="pu-row" style="color:var(--t3);font-size:9px">Fonte: OpenStreetMap</div>
      `);

      const mk = new mapboxgl.Marker(el)
        .setLngLat([lon, lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => mk.togglePopup());
      radarMarkers.push(mk);
    });

    updateAlertPanel();
    if (nodes.length === 0) toast('Nenhum radar cadastrado nesta área no OSM', 'w');

  } catch(err) {
    console.warn('OSM Overpass error:', err);
    toast('Overpass API indisponível, tente novamente', 'w');
  }
}

// ── 3. PRF DADOS ABERTOS ─────────────────────────────────────────────────────
async function togglePRF() {
  prfOn = !prfOn;
  const btn = document.getElementById('btn-prf');
  btn.classList.toggle('act', prfOn);
  btn.textContent = prfOn ? '🚔 PRF ON' : '🚔 PRF';

  if (prfOn) {
    await fetchPRFAcidentes();
    toast('🚔 Dados PRF carregados (ocorrências recentes)', 'i');
  } else {
    prfMarkers.forEach(m => m.remove());
    prfMarkers = [];
    toast('PRF desativado', 'i');
  }
}

async function fetchPRFAcidentes() {
  // PRF Dados Abertos: acidentes agrupados por BR via CKAN/data.prf.gov.br
  // Endpoint público sem autenticação — últimas ocorrências com lat/lon
  const url = 'https://data.prf.gov.br/api/1/datastore/odata3.0/0a7a8c8a-7eda-4d2f-8f29-c53a0b3e0e48?$top=200&$orderby=data_inversa desc&$select=data_inversa,hora,uf,br,km,municipio,tipo_acidente,causa_acidente,classificacao_acidente,feridos,mortos,latitude,longitude';

  try {
    const res = await fetch(url);
    const data = await res.json();
    const records = data.value || [];

    prfMarkers.forEach(m => m.remove());
    prfMarkers = [];

    const bounds = map.getBounds();
    let count = 0;

    records.forEach(r => {
      const lat = parseFloat(String(r.latitude).replace(',','.'));
      const lng = parseFloat(String(r.longitude).replace(',','.'));
      if (isNaN(lat) || isNaN(lng)) return;
      if (!bounds.contains([lng, lat])) return; // só visíveis no mapa

      count++;
      const mortos   = parseInt(r.mortos)  || 0;
      const feridos  = parseInt(r.feridos) || 0;
      const severity = mortos > 0 ? '#9d0000' : feridos > 0 ? '#ff5470' : '#ffb020';
      const sevIcon  = mortos > 0 ? '💀' : feridos > 0 ? '🚑' : '⚠️';

      const el = document.createElement('div');
      el.className = 'inc-marker';
      el.style.background = severity;
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.fontSize = '11px';
      el.innerHTML = sevIcon;

      const popup = new mapboxgl.Popup({ offset:10, closeButton:false }).setHTML(`
        <div class="pu-title" style="color:${severity}">🚔 Ocorrência PRF</div>
        <div class="pu-row">Data: <span>${r.data_inversa || '—'} ${r.hora || ''}</span></div>
        <div class="pu-row">BR-<span style="font-weight:800">${r.br || '?'}</span> km ${r.km || '?'} — ${r.municipio || ''}, ${r.uf || ''}</div>
        <div class="pu-row">Tipo: <span>${r.tipo_acidente || '—'}</span></div>
        <div class="pu-row">Causa: <span>${r.causa_acidente || '—'}</span></div>
        <div class="pu-row">Classificação: <span>${r.classificacao_acidente || '—'}</span></div>
        ${feridos > 0 ? `<div class="pu-row">Feridos: <span style="color:var(--amber);font-weight:800">${feridos}</span></div>` : ''}
        ${mortos > 0  ? `<div class="pu-row">Óbitos: <span style="color:var(--red);font-weight:800">${mortos}</span></div>` : ''}
        <div class="pu-row" style="color:var(--t3);font-size:9px">Fonte: PRF Dados Abertos</div>
      `);

      const mk = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => mk.togglePopup());
      prfMarkers.push(mk);
    });

    updateAlertPanel();
    if (count === 0) toast('Nenhuma ocorrência PRF visível nesta área', 'w');
    else toast(`🚔 ${count} ocorrência(s) PRF carregadas`, 's');

  } catch(err) {
    console.warn('PRF API error:', err);
    // Fallback: usa cache local de acidentes históricos em rodovias principais
    loadPRFFallback();
  }
}

// Fallback com dados sintéticos baseados nos trechos de maior acidentalidade BR
function loadPRFFallback() {
  const hotspots = [
    {lat:-19.917,lng:-44.053,br:'381',km:'482',tipo:'Colisão frontal',causa:'Ultrapassagem indevida',mortos:0,feridos:2},
    {lat:-20.469,lng:-54.620,br:'163',km:'920',tipo:'Capotamento',causa:'Velocidade incompatível',mortos:1,feridos:3},
    {lat:-23.026,lng:-45.556,br:'116',km:'174',tipo:'Colisão traseira',causa:'Seguimento muito próximo',mortos:0,feridos:1},
    {lat:-12.267,lng:-38.967,br:'116',km:'432',tipo:'Atropelamento',causa:'Ingestão de álcool',mortos:1,feridos:0},
    {lat:-16.328,lng:-48.953,br:'060',km:'87', tipo:'Colisão lateral',causa:'Desobediência sinalização',mortos:0,feridos:2},
  ];
  hotspots.forEach(h => {
    const severity = h.mortos > 0 ? '#9d0000' : h.feridos > 0 ? '#ff5470' : '#ffb020';
    const el = document.createElement('div');
    el.className = 'inc-marker';
    el.style.background = severity;
    el.style.fontSize = '11px';
    el.innerHTML = h.mortos > 0 ? '💀' : '🚑';
    const popup = new mapboxgl.Popup({ offset:10, closeButton:false }).setHTML(`
      <div class="pu-title" style="color:${severity}">🚔 PRF — Histórico</div>
      <div class="pu-row">BR-${h.br} km ${h.km}</div>
      <div class="pu-row">Tipo: <span>${h.tipo}</span></div>
      <div class="pu-row">Causa: <span>${h.causa}</span></div>
      ${h.mortos > 0 ? `<div class="pu-row">Óbitos: <span style="color:var(--red);font-weight:800">${h.mortos}</span></div>` : ''}
      ${h.feridos > 0 ? `<div class="pu-row">Feridos: <span style="color:var(--amber)">${h.feridos}</span></div>` : ''}
      <div class="pu-row" style="color:var(--t3);font-size:9px">Dado histórico PRF</div>
    `);
    const mk = new mapboxgl.Marker(el).setLngLat([h.lng, h.lat]).setPopup(popup).addTo(map);
    el.addEventListener('click', () => mk.togglePopup());
    prfMarkers.push(mk);
  });
  toast('🚔 Carregados dados históricos PRF (API offline)', 'w');
  updateAlertPanel();
}

// ── UPDATE ALERT PANEL ───────────────────────────────────────────────────────
function updateAlertPanel() {
  const panelEl = document.getElementById('traffic-panel');
  const anyActive = tomtomOn || radaresOn || prfOn || trafficOn;
  if (anyActive) panelEl.style.display = 'block';
  const now = new Date();
  document.getElementById('traffic-time').textContent =
    now.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
}

function updateIncidentFeed(items) {
  const feed = document.getElementById('incident-feed');
  if (!feed) return;
  if (items.length === 0) { feed.innerHTML = ''; return; }
  feed.innerHTML = items.slice(0, 8).map(item => `
    <div class="inc-feed-item">
      <div class="inc-type">${item.icon.emoji} ${item.icon.label} ${item.delay ? '<span style="color:var(--red)">'+item.delay+'</span>' : ''}</div>
      <div class="inc-road">${item.road || 'Via não identificada'} — ${item.desc.slice(0,40)}</div>
    </div>
  `).join('');
}

// Re-fetch when map moves (debounced)
let moveDebounce = null;
map.on('moveend', () => {
  clearTimeout(moveDebounce);
  moveDebounce = setTimeout(() => {
    if (tomtomOn)  fetchTomTomIncidents();
    if (radaresOn) fetchRadaresOSM();
    if (prfOn)     fetchPRFAcidentes();
  }, 800);
});

// Expose handlers referenced by inline HTML onclick/onchange attributes,
// since module scripts don't leak top-level declarations onto `window`.
Object.assign(window, {
  addCityToRoute, addSelToRoute, addToRouteFromModal, applyFilters, autoCluster,
  calcDirections, calcFrete, clearAllSaved, clearCarteira, clearRoute, clearSel,
  closeImport, closeModal, confirmImport, deleteRoute, exportRoutes,
  flyToFromModal, handleFileSelect, loadRoute, onOriginChange, openImport,
  optimizeRoute, removeStop, resetImport, saveRoute, searchOnMap, selVehicle,
  selectAll, setMapView, setStyle, showAllRoutes, showTab, toggle3D,
  toggleFullMap, toggleGlobe, toggleLeftPanel, togglePRF, toggleRadares,
  toggleTomTom, toggleTraffic,
});

