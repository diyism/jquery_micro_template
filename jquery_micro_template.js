/* Copyright (c) DIYism (email/msn/gtalk:kexianbin@diyism.com web:http://diyism.com)
* Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php) license.
*
* Version: kbcu
* Requires jQuery 1.1.3+
* Docs: http://code.google.com/p/jquery-micro-template/
*/

$.fn.clean_attribute
=function()
         {if (typeof(HTMLElement)=='undefined')//ie6 and ie7
             {var ele=this[0];
              var valid_attributes=$('<'+ele.tagName+'/>')[0].attributes;
              var attrs=[];
              var valid_attrs=[];
              for (var i in ele.attributes)
                  {attrs.push(i);
                  }
              for (var i in valid_attributes)
                  {valid_attrs.push(i);
                  }
              for (var i in attrs)
                  {if ($.inArray(attrs[i], valid_attrs)==-1)
                      {ele.removeAttribute(attrs[i]);
                      }
                  }
             }
          else
              {this.replaceWith(this.clone());
              }
         };

function htmlspecialchars_decode(str)
         {return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
                 .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
         }

function entity(str)
         {return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
         }

$.fn.drink = function(json)
             {$.fn.drink.path_js_tpl?'':($.fn.drink.path_js_tpl='/js_tpl');
              try {arguments.callee.name_class=(' '+this[0].className).split(' tpl_', 2)[1].split(' ', 2)[0];}
              catch (e) {arguments.callee.name_class=''}
              if (!arguments.callee.name_class)
                 {this.each(function(){this.innerHTML=json[this.id];});
                  return this;
                 }
              var name_tpl_fun_cache = 'tpl_fun_cache_'+arguments.callee.name_class;
              if (!window[name_tpl_fun_cache])
                 {var this_html=htmlspecialchars_decode(unescape(this.html()));//alert(this_html);
                  if (this_html.indexOf('<:')===-1)
                     {this[0].innerHTML=$.ajax({async:false, url:$.fn.drink.path_js_tpl+'/'+arguments.callee.name_class+'.htm'}).responseText;
                     }
                  var tpl=this_html
                          .replace(/<!--|&lt;:|\/\*/g, "<:")
                          .replace(/!-->|-->|:&gt;|\*\/|:="">/g, ":>")
                          .replace(/\r|\*+="/g, ' ')
                          .split('<:').join("\r")
                          .replace(/(?:^|:>)[^\r]*/g,
                                   function(str){return str.replace(/'|\\/g, "\\$&").replace(/\n/g, "\\n");}
                                  )
                          .replace(/\r=(.*?):>/g, "',$1,'")
                          .split("\r").join("');")
                          .split(':>').join("write.push('");
                  var str_fun="var write=[];var rnd_id=json.rnd_id;delete json.rnd_id;with (json){write.push('"+tpl+"');}return write.join('');";//alert(str_fun);
                  window[name_tpl_fun_cache]=new Function('json', str_fun);
                 }
              if (!json)
                 {return this;
                 }
              this.html(window[name_tpl_fun_cache](json));
              arguments[1] || this.show(); // is_keep_hidden, default false
              arguments[2] && this.clean_attribute(); //is_to_refresh, default false
              return this;
             };

$.fn.dress=function()
           {var json=eval('('+this[0].innerHTML+')');
            this.replaceWith('<div id="'+this[0].id+'" class="'+this[0].className+'"></div>');
            $('#'+this[0].id).drink(json);
           }
