/*
 * Jsonix is a JavaScript library which allows you to convert between XML
 * and JavaScript object structures.
 *
 * Copyright (c) 2010 - 2014, Alexey Valikov, Highsource.org
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Alexey Valikov nor the
 *       names of contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ALEXEY VALIKOV BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

Jsonix.Schema.XSD.Base64Binary = Jsonix
		.Class(
				Jsonix.Schema.XSD.AnySimpleType,
				{
					name : 'Base64Binary',
					typeName : Jsonix.Schema.XSD.qname('base64Binary'),
					charToByte : {},
					byteToChar : [],
					initialize : function() {
						Jsonix.Schema.XSD.AnySimpleType.prototype.initialize
								.apply(this);
						// Initialize charToByte and byteToChar table for fast
						// lookups
						var charTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
						for ( var i = 0; i < charTable.length; i++) {
							var _char = charTable.charAt(i);
							var _byte = charTable.charCodeAt(i);
							this.byteToChar[i] = _char;
							this.charToByte[_char] = i;
						}
					},
					print : function(value) {
						Jsonix.Util.Ensure.ensureArray(value);
						return this.encode(value);
					},

					parse : function(text) {
						Jsonix.Util.Ensure.ensureString(text);
						return this.decode(text);
					},
					encode : function(uarray) {
						var output = "";
						var byte0;
						var byte1;
						var byte2;
						var char0;
						var char1;
						var char2;
						var char3;
						var i = 0;
						var j = 0;
						var length = uarray.length;

						for (i = 0; i < length; i += 3) {
							byte0 = uarray[i] & 0xFF;
							char0 = this.byteToChar[byte0 >> 2];

							if (i + 1 < length) {
								byte1 = uarray[i + 1] & 0xFF;
								char1 = this.byteToChar[((byte0 & 0x03) << 4)
										| (byte1 >> 4)];
								if (i + 2 < length) {
									byte2 = uarray[i + 2] & 0xFF;
									char2 = this.byteToChar[((byte1 & 0x0F) << 2)
											| (byte2 >> 6)];
									char3 = this.byteToChar[byte2 & 0x3F];
								} else {
									char2 = this.byteToChar[(byte1 & 0x0F) << 2];
									char3 = "=";
								}
							} else {
								char1 = this.byteToChar[(byte0 & 0x03) << 4];
								char2 = "=";
								char3 = "=";
							}
							output = output + char0 + char1 + char2 + char3;
						}
						return output;
					},
					decode : function(text) {

						input = text.replace(/[^A-Za-z0-9\+\/\=]/g, "");

						var length = (input.length / 4) * 3;
						if (input.charAt(input.length - 1) === "=") {
							length--;
						}
						if (input.charAt(input.length - 2) === "=") {
							length--;
						}

						var uarray = new Array(length);

						var byte0;
						var byte1;
						var byte2;
						var char0;
						var char1;
						var char2;
						var char3;
						var i = 0;
						var j = 0;

						for (i = 0; i < length; i += 3) {
							// get the 3 octects in 4 ascii chars
							char0 = this.charToByte[input.charAt(j++)];
							char1 = this.charToByte[input.charAt(j++)];
							char2 = this.charToByte[input.charAt(j++)];
							char3 = this.charToByte[input.charAt(j++)];

							byte0 = (char0 << 2) | (char1 >> 4);
							byte1 = ((char1 & 0x0F) << 4) | (char2 >> 2);
							byte2 = ((char2 & 0x03) << 6) | char3;

							uarray[i] = byte0;
							if (char2 != 64) {
								uarray[i + 1] = byte1;
							}
							if (char3 != 64) {
								uarray[i + 2] = byte2;
							}
						}
						return uarray;
					},
					isInstance : function(value) {
						return Jsonix.Util.Type.isArray(value);
					},
					CLASS_NAME : 'Jsonix.Schema.XSD.Base64Binary'
				});
Jsonix.Schema.XSD.Base64Binary.INSTANCE = new Jsonix.Schema.XSD.Base64Binary();
Jsonix.Schema.XSD.Base64Binary.INSTANCE.LIST = new Jsonix.Schema.XSD.List(
		Jsonix.Schema.XSD.Base64Binary.INSTANCE);